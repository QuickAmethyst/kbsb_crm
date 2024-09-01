import css from 'styled-jsx/css';

const { className: stickyColumnCN, styles: stickyColumnStyles } = css.resolve`
  th,
  td {
    position: sticky;
  }

  .hasFixLeft th.leftLast::after,
  .hasFixLeft td.leftLast::after,
  .hasFixRight th.rightLast::after,
  .hasFixRight td.rightLast::after {
    opacity: 1;
  }

  th.shadowed::after,
  td.shadowed::after {
    content: '';
    pointer-events: none;
    width: 30px;
    position: absolute;
    top: 0;
    bottom: -1px;
    opacity: 0;
  }

  th.leftLast::after,
  td.leftLast::after {
    right: 0;
    transform: translateX(100%);
    box-shadow: inset 10px 0 8px -8px rgba(5, 5, 5, 0.06);
  }

  th.rightLast::after,
  td.rightLast::after {
    left: 0;
    transform: translateX(-100%);
    box-shadow: inset -10px 0 8px -8px rgba(5, 5, 5, 0.06);
  }
`;

export { stickyColumnCN, stickyColumnStyles };
