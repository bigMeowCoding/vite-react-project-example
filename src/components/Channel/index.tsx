import { useEffect } from 'react';
import { sum } from './sum';

function Index() {
  useEffect(() => {
    const s = sum(1, 2);
    console.log(s);
  }, []);
  return <div> Index</div>;
}
export default Index;
