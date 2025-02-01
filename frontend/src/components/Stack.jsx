import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";

function CardRotate({ children, onSendToBack, sensitivity,  }) {
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
  onTemplateSelect
}) {
  const [cards, setCards] = useState(
    cardsData.length
      ? cardsData
      : [
        { id: 1, img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=500&auto=format", template: "Template 1" },
        { id: 2, img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=500&auto=format", template: "Template 2" },
        { id: 3, img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=500&auto=format", template: "Template 3" },
        { id: 4, img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=500&auto=format", template: "Template 4" }
      ]
  );

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
    <div
      className="relative" 
      style={{
        width: cardDimensions.width,
        height: cardDimensions.height,
        perspective: 600,
      }}
    >
      {cards.map((card, index) => {
        const randomRotate = randomRotation
          ? Math.random() * 10 - 5
          : 0;

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
              </div>
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}