import React from 'react'

function About() {
  return (
    <div>
        <div className="ml-16 mt-8 lg:ml-32">
            <h2 className="text-[#C7FF65] text-4xl font-bold">
                What is Keylilt?
            </h2>

            <p className="text-[#A5A5A5] text-lg max-w-3xl mt-4 leading-relaxed ml-8">
                Keylilt is a minimalist, distraction-free typing site designed to help you focus on typing without unnecessary clutter.
                Whether you're a writer, developer, or student, Keylilt provides a seamless, intuitive typing experience.
            </p>
        </div>
        <div className="ml-16 mt-8 lg:ml-32">
            <h2 className="text-[#C7FF65] text-4xl font-bold">
            Why Keylilt?
            </h2>

            <p className="text-[#A5A5A5] text-lg max-w-3xl mt-4 leading-relaxed ml-8">
                Keylilt provides a clean, minimalist typing experience without distractions that hinder productivity. It includes only the essential features, ensuring a seamless and focused typing experience.</p>
        </div>

        <div className="ml-16 mt-8 lg:ml-32">
            <h2 className="text-[#C7FF65] text-4xl font-bold">
                Who Made Keylilt?
            </h2>

            <p className="text-[#A5A5A5] text-lg max-w-3xl mt-4 leading-relaxed ml-8">
                I'm Arghya Pal, an engineering student and full stack developer <a href="https:///" className='text-blue-400 hover:underline'> Know more</a>
            </p>
        </div>

    </div>
  )
}

export default About
