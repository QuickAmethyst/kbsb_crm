package grace

import (
	"errors"
	"fmt"
	"net"
	"net/http"
	"os"
	"os/signal"
	"time"

	sdkErrors "github.com/QuickAmethyst/kbsb_crm/stdlibgo/errors"
	"github.com/QuickAmethyst/kbsb_crm/stdlibgo/logger"
	"github.com/cloudflare/tableflip"
)

type Options struct {
	UpgradeTimeout  time.Duration
	ShutdownTimeout time.Duration
	Network         string
}

type Server interface {
	Name() string
	Addr() string
	Serve(ln net.Listener) error
	Shutdown() error
}

type Grace interface {
	Serve(servers ...Server)
	Stop() error
	ListenForUpgrade(sigToResets ...os.Signal)
}

func New(logger logger.Logger, opt Options) (Grace, error) {
	upg, err := tableflip.New(tableflip.Options{UpgradeTimeout: opt.UpgradeTimeout})
	if err != nil {
		return nil, err
	}

	if opt.Network == "" {
		opt.Network = "tcp"
	}

	return &gc{
		upgrader: upg,
		opt:      opt,
		logger:   logger,
	}, nil
}

type gc struct {
	opt      Options
	upgrader *tableflip.Upgrader
	logger   logger.Logger
}

func (g *gc) Serve(servers ...Server) {
	for i := 0; i < len(servers); i++ {
		server := servers[i]
		ln, err := g.upgrader.Listen(g.opt.Network, server.Addr())
		if err != nil {
			g.logger.Panic(fmt.Sprintf("Can't listen: %s", err.Error()))
		}

		go func() {
			err := server.Serve(ln)
			if err != nil {
				if !errors.Is(err, http.ErrServerClosed) {
					g.logger.Info(fmt.Sprintf("%s shutting down", server.Name()))
				} else {
					g.logger.Panic(err.Error())
				}
			}
		}()

		g.logger.Info(fmt.Sprintf("%s listening to address %s", server.Name(), server.Addr()))
	}

	g.logger.Info("Ready")
	if err := g.upgrader.Ready(); err != nil {
		err = sdkErrors.PropagateWithCode(err, sdkErrors.ErrCodeReadyStateFiled, "[Error] Ready state failed.")
		g.logger.Panic(err.Error())
	}

	<-g.upgrader.Exit()

	// Make sure to set a deadline on exiting the process
	// after upg.Exit() is closed. No new upgrades can be
	// performed if the parent doesn't exit.
	time.AfterFunc(g.opt.ShutdownTimeout, func() {
		g.logger.Fatal("Graceful shutdown timed out, forcing shutdown.")
		os.Exit(1)
	})

	for i := 0; i < len(servers); i++ {
		server := servers[i]
		if err := server.Shutdown(); err != nil {
			g.logger.Fatal(err.Error())
		}
	}
}

// ListenForUpgrade listen for signals to do an upgrade
func (g *gc) ListenForUpgrade(sigToResets ...os.Signal) {
	c := make(chan os.Signal, 1)
	signal.Notify(c, sigToResets...)
	for range c {
		if err := g.upgrader.Upgrade(); err != nil {
			err = sdkErrors.PropagateWithCode(err, sdkErrors.ErrCodeUpgradeFailed, "[Error] Grace Upgrade Failed.")
			g.logger.Error(err.Error())
		}
	}
}

func (g *gc) Stop() error {
	g.upgrader.Stop()
	return nil
}
