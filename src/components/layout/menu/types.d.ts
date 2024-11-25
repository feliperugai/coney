interface Group {
  groupLabel: string;
  menus: {
    label: string;
    href: string;
    icon: React.ReactNode;
  }[];
}
