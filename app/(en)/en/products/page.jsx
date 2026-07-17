import { permanentRedirect } from 'next/navigation';

export default function EnglishProductsRedirect() {
  permanentRedirect('/en');
}
