import { LinkingOptions } from '@react-navigation/native';

export const deepLinkingConfig: LinkingOptions<any> = {
  prefixes: ['amrutam://', 'https://amrutam.co.in'],
  config: {
    screens: {
      ConsultationTab: {
        screens: {
          DoctorList: 'consultations',
          DoctorDetail: 'consultation/doctor/:id',
          Booking: 'consultation/book/:doctorId',
          UpcomingConsultations: 'consultations/upcoming',
        },
      },
      ShopTab: {
        screens: {
          ProductList: 'shop',
          ProductDetail: 'shop/product/:id',
          Cart: 'shop/cart',
          Checkout: 'shop/checkout',
        },
      },
      HealthTab: {
        screens: {
          Timeline: 'records',
          RecordDetail: 'records/:id',
        },
      },
      SettingsTab: {
        screens: {
          Settings: 'settings',
        },
      },
    },
  },
};
