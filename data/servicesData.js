// servicesData.js
export default {
  Plumber: [
    {
      id: 1,
      name: "Pipe Fixing",
      price: 100,
      image: require("../assets/plumb.jpg"),
      description: "Fix leaking or broken pipes efficiently.",
      duration: "Approx. 1 hr",
      rating: 4.5,
      tags: ["Popular", "Emergency"]
    },
    {
      id: 2,
      name: "Tap Replacement",
      price: 150,
      image: require("./ac.jpg"),
      description: "Replace old or damaged taps with new ones.",
      duration: "Approx. 30 mins",
      rating: 4.2,
      tags: []
    },
    {
      id: 3,
      name: "Drain Cleaning",
      price: 200,
      image: require("./ac.jpg"),
      description: "Clear clogged drains quickly and safely.",
      duration: "Approx. 45 mins",
      rating: 4.6,
      tags: ["Popular"]
    }
  ]
,  
  Electrician: [
    { id: 1, name: "Fan Repair", price: 250, image: require("../assets/elec.jpg") },
    { id: 2, name: "Light Installation", price: 150, image: require("./ac.jpg") },
    { id: 3, name: "Wiring Fix", price: 350, image: require("./ac.jpg") }
  ],
  Painter: [
    { id: 1, name: "Wall Painting", price: 800, image: require("../assets/paint.jpg") },
    { id: 2, name: "Ceiling Painting", price: 600, image: require("./ac.jpg") }
  ],
  Carpenter: [
    { id: 1, name: "Furniture Fixing", price: 700, image: require("./ac.jpg") },
    { id: 2, name: "Door Repair", price: 500, image: require("./ac.jpg") }
  ],
  Cleaner: [
    { id: 1, name: "Home Cleaning", price: 400, image: require("./ac.jpg") },
    { id: 2, name: "Bathroom Cleaning", price: 300, image: require("./ac.jpg") }
  ],
  "AC Repair": [
    { id: 1, name: "AC Installation", price: 1200, image: require("./ac.jpg") },
    { id: 2, name: "AC Gas Refill", price: 800, image: require("./ac.jpg") }
  ]
};
