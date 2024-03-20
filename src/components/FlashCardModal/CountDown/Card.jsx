'use client'
import { Button } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import { useSpeechSynthesis } from 'react-speech-kit'
import useSound from 'use-sound'
import { FaVolumeLow } from 'react-icons/fa6'
import { Image } from '@nextui-org/react'

const Card = ({ data, active, onNext, onPrev }) => {
  const [playSound] = useSound('/sound/flipcard.mp3')

  const [card, setCard] = useState(data)
  const [isFlipped, setIsFlipped] = useState(false)
  const [leaveX, setLeaveX] = useState(0)
  const [leaveY, setLeaveY] = useState(0)
  const isDrag = useRef(false)

  useEffect(() => {
    if (JSON.stringify(card) !== JSON.stringify(data)) {
      setCard(data)
      setIsFlipped(false)
    }
  }, [data])

  const onDragEnd = (_e, info) => {
    console.log(info.offset.y, info.offset.x)
    // if (info.offset.y < -100) {
    //   setLeaveY(-2000)
    //   removeCard(card, 'superlike')
    //   return
    // }
    // if (info.offset.x > 100) {
    //   setLeaveX(1000)
    //   removeCard(card, 'like')
    // }
    // if (info.offset.x < -100) {
    //   setLeaveX(-1000)
    //   removeCard(card, 'nope')
    // }
    if (info.offset.x > 100) {
      setLeaveX(1000)
      onNext()
      setIsFlipped(false)
    }
    if (info.offset.x < -100) {
      setLeaveX(-1000)
      onPrev()
      setIsFlipped(false)
    }
    isDrag.current = false
  }

  const handleFlipp = () => {
    if (isDrag.current) return
    setIsFlipped((s) => !s)
    playSound()
  }

  const classNames = `absolute h-[330px] w-[200px] md:h-[430px] md:w-[300px] bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col cursor-grab`
  return (
    <>
      {active ? (
        <motion.div
          drag={true}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          onDrag={() => {
            isDrag.current = true
          }}
          onDragEnd={onDragEnd}
          onClick={handleFlipp}
          initial={{
            scale: 1,
          }}
          animate={{
            scale: 1.05,
            rotate: `${card.name.length % 2 === 0 ? 6 : -6}deg`,
          }}
          exit={{
            x: leaveX,
            y: leaveY,
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.2 },
          }}
          className={classNames}
          data-testid='active-card'
        >
          <ReactCardFlip
            containerClassName='h-full w-full'
            isFlipped={isFlipped}
            flipDirection='horizontal'
          >
            <CardItem
              image={card.frontImage}
              text={card.frontText}
              color={card.color}
            />

            <CardItem
              image={card.backImage}
              text={card.backText}
              color={card.color}
            />
          </ReactCardFlip>
        </motion.div>
      ) : (
        <div
          className={`${classNames} ${
            card.name.length % 2 === 0 ? 'rotate-6' : '-rotate-6'
          }`}
        >
          <CardItem
            image={card.frontImage}
            text={card.frontText}
            color={card.color}
          />
        </div>
      )}
    </>
  )
}

const CardItem = ({ image, text, color }) => {
  const { speak } = useSpeechSynthesis()

  if (!image && text) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
        style={{ backgroundColor: color }}
      >
        <div className='absolute bottom-2 left-2 right-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white'>
          <p className='text-center text-2xl font-semibold'>{text}</p>
        </div>

        <Button
          className='absolute left-2 top-2'
          color='primary'
          isIconOnly
          variant='light'
          onPress={() => speak({ text })}
        >
          <FaVolumeLow size={30} />
        </Button>
      </div>
    )
  }
  if (image && !text) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
        style={{ backgroundColor: color }}
      >
        <div className='absolute bottom-2 left-2 right-2 top-2 flex flex-col items-center justify-center rounded-lg bg-white'>
          <Image
            draggable={false}
            className='h-[330px] w-[200px] rounded-lg md:h-[430px] md:w-[300px]'
            src={image}
          />
        </div>
      </div>
    )
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center bg-blue-400`}
      style={{ backgroundColor: color }}
      // onClick={onClick}
    >
      <div className='absolute bottom-2 left-2 right-2 top-2 overflow-hidden rounded-lg bg-white'>
        <Image
          draggable={false}
          className='h-[314px] w-[184px] rounded-xl md:h-[414px] md:w-[284px]'
          src={image}
        />
        <div
          className='absolute bottom-0 left-0 right-0 flex w-full flex-col border-t-4 border-blue-400 bg-white p-2 text-center'
          style={{
            borderColor: color,
          }}
        >
          {text}
        </div>
      </div>
      <Button
        className='absolute left-2 top-2'
        color='primary'
        isIconOnly
        variant='light'
        onPress={() => speak({ text })}
      >
        <FaVolumeLow size={30} />
      </Button>
    </div>
  )
}

export default Card
