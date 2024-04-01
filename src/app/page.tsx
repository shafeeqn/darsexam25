"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex w-screen h-screen bg-smoke items-center justify-center bg">
      {/* <div className="flex flex-col items-center justify-center">
        <img
          src="/Logo.png"
          alt="Picture of the author"
          className="object-contain w-72 md:w-auto"
        />
        <br />
        <br />
        <h1 className="md:text-5xl text-3xl font-bold">JM DARS Examination Portal</h1>
        </div> */}

      <div className="flex flex-col items-center justify-center">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 1.8,
            delay: 0.5,
            ease: [0, 0.71, 0.2, 1.01]
          }}
        >
          <img
            src="/Logo.png"
            alt="Picture of the author"
            className="object-contain w-72 md:w-auto"
          />
          {/* <br />
        <br /> */}
          {/* <h1 className="md:text-5xl text-3xl font-bold">JM DARS Examination Portal</h1> */}

          {/* three buttens */}
          <br />

        </motion.div>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <a href="/login" className="hover:bg-light border-primary border rounded-lg text-white px-3 py-1 bg-primary">
            Login
          </a>
          {/* <a href="/about" className="hover:bg-light border-primary border rounded-lg text-white px-3 py-1 bg-primary">
            About
          </a>
          <a href="/student" className="hover:bg-light border-primary border rounded-lg text-white px-3 py-1 bg-primary">
            Student
          </a> */}
        </div>
      </div>

    </div>
  );
}

// export default function Home() {
//   return (
//     <div className="flex w-screen h-screen bg-smoke items-center justify-center bg">
//      <h1 className="text-3xl text-center font-bold">website is under maintenance</h1>
//       </div>
//   );
// }

