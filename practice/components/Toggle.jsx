// import React from 'react'
// import { useState } from 'react'
// const Toggle = () => {
//   const [showMore, setShowMore] = useState(false)
//   const fullText = " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti. "
//   const shortText = "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti."
//   return (
//     <div>
//     <p>{showMore ? fullText : shortText}</p>
//     <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={() => setShowMore(!showMore)}>{showMore ? "View Less" : "View More"}</button>
//     </div>
//   )
// }

// export default Toggle


import { useState } from 'react'

const Toggle = () => {
  const [showMore, setShowMore] = useState(false)

  const text =
    "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti. Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea accusantium eveniet molestiae, alias labore itaque beatae, velit, iste illo fugit assumenda! Mollitia laboriosam perferendis quos dicta labore harum laborum deleniti."

  const previewLimit = 180 
  const displayText = showMore ? text : text.slice(0, previewLimit) + "..."

  return (
    <div>
      <p>{displayText}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "View Less" : "View More"}
      </button>
    </div>
  )
}

export default Toggle

