export interface MenuSection {
  section: string;
  children: { title: string; icon: string; href: string }[];
}

export interface MenuItem {
  title: string;
  icon: string;
  href: string;
}
