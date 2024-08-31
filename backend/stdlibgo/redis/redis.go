package redis

import "github.com/redis/go-redis/v9"

type (
	UniversalOptions = redis.UniversalOptions
	UniversalClient  = redis.UniversalClient
)

func NewUniversalClient(opt *UniversalOptions) (UniversalClient, error) {
	rdb := redis.NewUniversalClient(opt)

	return rdb, nil
}
