import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  icon?: string;
  url?: string;
  classes?: string;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}
const NavigationItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Dashboard',
        title: 'Dashboard',
        type: 'item',
        classes: 'nav-item',
        url: '/admin/default',
        icon: 'ti ti-dashboard',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'users',
    title: 'users',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'users',
        title: 'users',
        type: 'item',
        classes: 'nav-item',
        icon: 'ti ti-user',
        url: '/view-user',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'Positions',
    title: 'Positions',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Positions',
        title: 'Positions',
        type: 'collapse',
        icon: 'ti ti-user',
        children: [
          {
            id: 'add-position',
            title: 'add-position',
            type: 'item',
            url: '/add-position',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'edit-user',
            title: 'view-positions',
            type: 'item',
            url: '/view-position',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'edit-positions',
            title: 'edit-positions',
            type: 'item',
            url: '/edit-positions',
            target: true,
            breadcrumbs: false
          },
        ]
      }
    ]
  },
  {
    id: 'Videos',
    title: 'Videos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'Videos',
        title: 'Videos',
        type: 'collapse',
        icon: 'ti ti-user',
        children: [
          {
            id: 'add-videos',
            title: 'add-videos',
            type: 'item',
            url: '/add-videos',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'view-Videos',
            title: 'view-videos',
            type: 'item',
            url: '/view-videos',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'edit-positions',
            title: 'edit-Videos',
            type: 'item',
            url: '/edit-Videos',
            target: true,
            breadcrumbs: false
          },
        ]
      }
    ]
  },
  // {
  //   id: 'payments',
  //   title: 'payments',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'payments',
  //       title: 'payments',
  //       type: 'collapse',
  //       url: '/view-payments',
  //       icon: 'ti ti-user',
  //       target: false,
  //       breadcrumbs: false
  //     }
  //   ]
  // },

  {
    id: 'payments',
    title: 'payments',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'payments',
        title: 'payments',
        type: 'item',
        classes: 'nav-item',
        icon: 'ti ti-user',
        url: '/view-payments',
        breadcrumbs: false
      }
    ]
  },
  {
    id: 'notifications',
    title: 'notifications',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'notifications',
        title: 'notifications',
        type: 'collapse',
        icon: 'ti ti-user',
        children: [
          {
            id: 'view-payments',
            title: 'view-notifications',
            type: 'item',
            url: '/view-notifications',
            target: false,
            breadcrumbs: false
          },
          {
            id: 'send-notifications',
            title: 'edit-payments',
            type: 'item',
            url: '/send-notifications',
            target: true,
            breadcrumbs: false
          },
        ]
      }
    ]
  },
  // {
  //   id: 'elements',
  //   title: 'Elements',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'typography',
  //       title: 'Typography',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/typography',
  //       icon: 'ti ti-typography'
  //     },
  //     {
  //       id: 'color',
  //       title: 'Colors',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: '/color',
  //       icon: 'ti ti-brush'
  //     },
  //     {
  //       id: 'tabler',
  //       title: 'Tabler',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://tabler-icons.io/',
  //       icon: 'ti ti-plant-2',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // },
  // {
  //   id: 'other',
  //   title: 'Other',
  //   type: 'group',
  //   icon: 'icon-navigation',
  //   children: [
  //     {
  //       id: 'sample-page',
  //       title: 'Sample Page',
  //       type: 'item',
  //       url: '/sample-page',
  //       classes: 'nav-item',
  //       icon: 'ti ti-brand-chrome'
  //     },
  //     {
  //       id: 'document',
  //       title: 'Document',
  //       type: 'item',
  //       classes: 'nav-item',
  //       url: 'https://codedthemes.gitbook.io/berry-angular/',
  //       icon: 'ti ti-vocabulary',
  //       target: true,
  //       external: true
  //     }
  //   ]
  // }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
