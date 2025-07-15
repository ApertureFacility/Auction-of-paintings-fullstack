import { Inter, Roboto } from 'next/font/google';
import localFont from 'next/font/local';


export const inter = Inter({ subsets: ['latin'] });
export const roboto = Roboto({ weight: '400', subsets: ['latin'] });


export const gilroy = localFont({
  src: [
    {
      path: '../fonts/Gilroy-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../fonts/Gilroy-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gilroy',
  display: 'swap',
});