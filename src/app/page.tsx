'use client'
import { useEffect, useState } from 'react';
import CanvasComponent from './game/game';
import '@/app/globals.css'


// const GetDimentions = () => {
//   const hhh = 13;
//   const [width, setWidth] = useState(`'${hhh}'`);
//   useEffect(() => {
//     const myObserver = new ResizeObserver((data) =>{
//       const containerWidth = data[0].contentRect.width;
//       const containerHeight = data[0].contentRect.height;
//       const per = (90 * containerWidth)/100
//       // document.documentElement.style.setProperty(`--containerHeight`, `'${containerHeight}'`);
//       // document.documentElement.style.setProperty(`--container-width`, `'${per}'`)
//       console.log("W: ", containerWidth, "H: ",containerHeight, "P: ", per);
//     });
//     // const size: any = document.querySelector('.pongContainer') ;
//     // myObserver.observe(size);
//     // console.log("width: ", size?.getBoundingClientRect().width, "height:" , size?.getBoundingClientRect().height);
//   },[])
//   return (
//     <div className="pongContainer" >
//       <div className='pongHeader'>
//         header
//         </div>
//       <div className="pongTable"> 
           
//          </div> 
//     </div >
//   );
// }


export default function Home() {
  return (
    <>
      <div className="pongContainer" >
        <div className='pongHeader'>
          header
        </div>
       <div className="pongTable"> 
          <CanvasComponent  /> 
        </div>
     </div> 
    </>
  );
}
