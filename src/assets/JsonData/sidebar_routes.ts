import adminIcon from '@app/components/Icons/Admin/Admin'
export default [
  {
    display_name: {
      en: 'Dashboard',
      ru: 'Панель приборов',
      tm: 'Dolandyryş paneli'
    },
    route: '/dashboard',
    icon: 'bx bx-category-alt',
    sub: []
  },
  {
    display_name: {
      en: 'Reports',
      ru: 'Отчеты',
      tm: 'Hasabatlar'
    },
    route: '/report',
    icon: 'bx bx-user-pin',
    sub: []
  },
  {
    display_name: {
      en: 'Admin',
      ru: 'Admin',
      tm: 'Admin'
    },
    route: '/administrator',
    svg: adminIcon(), 
    icon: '',
    sub: [],
  },

]


  // {
  //   display_name: {
  //     en: 'Map',
  //     ru: 'Карта',
  //     tm: 'Karta'
  //   },
  //   route: '/map-reference',
  //   image: {white: map_white, black: map_black},  
  //   icon: '',
  //   sub: []
  // },
  // {
  //   display_name: {
  //     en: 'Forecast',
  //     ru: 'Прогноз',
  //     tm: 'Çaklama'
  //   },
  //   route: '/forecast',
  //   icon: 'bx bx-cog',
  //   sub: []
  // }