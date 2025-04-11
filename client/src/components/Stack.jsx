import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { createPortal } from "react-dom";

function CardRotate({ children, onSendToBack, sensitivity }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_, info) {
    if (
      Math.abs(info.offset.x) > sensitivity ||
      Math.abs(info.offset.y) > sensitivity
    ) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

export default function Stack({
  randomRotation = false,
  sensitivity = 200,
  cardDimensions = { width: 208, height: 208 },
  cardsData = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = true,
  onTemplateSelect,
}) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
          {
            id: 1,
            img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format",
            template: "Template 1",
          },
          {
            id: 2,
            img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format",
            template: "Template 2",
          },
          {
            id: 3,
            img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format",
            template: "Template 3",
          },
          {
            id: 4,
            img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format",
            template: "Template 4",
          },
        ]
  );

  // Add state for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);

  // Function to open modal
  const openModal = (img) => {
    setCurrentImage(img);
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Mock additional preview images - in a real app, these would likely come from props or API
  const getAdditionalImages = (mainImage) => {
    // Here we're just creating variations for demo purposes
    // In a real app, you'd probably have actual before/after images
    return [
      mainImage,
      "https://res.cloudinary.com/dlthjlibc/image/upload/v1740654640/Screenshot_2025-02-27_160947_fecwfu.png", // Desaturated version
      "https://res.cloudinary.com/dlthjlibc/image/upload/v1740654640/Screenshot_2025-02-27_161002_yccv8a.png", // Blurred version
      "https://res.cloudinary.com/dlthjlibc/image/upload/v1740654640/Screenshot_2025-02-27_161012_bpw67j.png",
    ];
  };

  const sendToBack = (id) => {
    setCards((prev) => {
      const newCards = [...prev];
      const index = newCards.findIndex((card) => card.id === id);
      const [card] = newCards.splice(index, 1);
      newCards.unshift(card);

      if (onTemplateSelect) {
        onTemplateSelect(newCards[newCards.length - 1].template);
      }

      return newCards;
    });
  };

  useEffect(() => {
    if (cards.length && onTemplateSelect) {
      onTemplateSelect(cards[cards.length - 1].template);
    }
  }, []);

  return (
    <>
      <div
        className="relative"
        style={{
          width: cardDimensions.width,
          height: cardDimensions.height,
          perspective: 600,
        }}
      >
        {cards.map((card, index) => {
          const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;

          return (
            <CardRotate
              key={card.id}
              onSendToBack={() => sendToBack(card.id)}
              sensitivity={sensitivity}
            >
              <motion.div
                className="absolute w-full h-full rounded-lg overflow-hidden cursor-pointer shadow-xl"
                onClick={() => sendToBack(card.id)}
                animate={{
                  rotateZ: (cards.length - index - 1) * 4 + randomRotate,
                  scale: 1 + index * 0.06 - cards.length * 0.06,
                  transformOrigin: "90% 90%",
                }}
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: animationConfig.stiffness,
                  damping: animationConfig.damping,
                }}
                style={{
                  width: cardDimensions.width,
                  height: cardDimensions.height,
                }}
              >
                <div className="relative w-full h-full ">
                  <img
                    src={card.img}
                    alt={`card-${card.id}`}
                    className="w-full h-full object-fit"
                  />
                  <span className="absolute bottom-4 left-4 bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold">
                    {card.template}
                  </span>
                  <span className="absolute bottom-4 right-4 bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold">
                    After
                  </span>
                  <span
                    className="absolute top-4 right-4 bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(card.img);
                    }}
                  >
                    <Eye size={16} />
                  </span>
                </div>
              </motion.div>
            </CardRotate>
          );
        })}
      </div>

      {/* Image Preview Modal - using portal to render at document body level */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-col justify-between items-center mb-4">
                <div className="flex justify-between items-center w-full">
                <div className="flex gap-2">
                  <h3 className="text-xl font-semibold">Template Preview</h3>
                  <span className="bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold">
                    v2
                  </span>
                </div>
                
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  <X size={24} />
                </button>
                </div>
              <p>This is the template preview showcasing all sections with populated data. If your CV contains similar structured information, it will enhance its effectiveness.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {getAdditionalImages(currentImage).map((img, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <span className=" absolute bottom-4 left-4 bg-[#2563EB] text-white px-2 py-1 rounded text-sm font-semibold">
                        Page {index+1}
                      </span>
                    </div>

                    {/* <div className="bg-[#2563EB] text-white py-2 px-3 text-center font-medium">
                    {index === 0 ? "After" : index === 1 ? "Before" : "Comparison"}
                  </div> */}
                  </div>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
