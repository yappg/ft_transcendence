import React from 'react';

function page() {
  return (
    <div className="bg-side-bar col-span-9 col-start-2 row-span-8 row-start-2 grid grid-cols-5 grid-rows-[repeat(14,_1fr)] rounded-[50px] shadow-2xl">
      {/* <div className="rounded-[50px]"> */}
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white">1</div>
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white ">2</div>
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white ">3</div>
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white ">4</div>
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white ">5</div>
      <div className="col-span-5 row-span-2 border-b border-[#1C1C1C] dark:border-white ">6</div>
      <div className="col-span-5 row-span-2 ">7</div>
      {/* </div> */}
    </div>
  );
}

export default page;
