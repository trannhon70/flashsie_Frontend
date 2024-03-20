'use client'
import React, { useEffect, useRef, useState } from 'react'

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import * as flashsetsAPI from '~/apis/flashsets'
import { shuffle } from '~/utils/helpers'
import Cards from './Cards'

export default function LearnModal({ children, flashsetId: id }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [perPage, setPerPage] = useState(200)
  const [page, setPage] = useState(1)
  const [idx, setIdx] = useState(-1)
  const [total, setTotal] = useState(0)
  const [arrImg, setArrImg] = useState([])

  const imagesOfCard = useRef([])
  const refCards = useRef()

  const [answers, setAnswers] = useState(new Array(4))
  const [arrSelecte, setArrSelecte] = useState(new Array(4))

  const cards = useQuery({
    enabled: isOpen,
    queryKey: ['flashset-cards', id, page, perPage],
    queryFn: () =>
      flashsetsAPI.getFlashcards({ id, page, perPage }).then((res) => {
        setTotal(res.data?.length)
        imagesOfCard.current = res?.data?.reduce((p, n) => {
          if (n.frontImage && n.backImage) {
            p.push(n.frontImage, n.backImage)
          }
          if (n.frontImage) {
            p.push(n.frontImage)
          }
          if (n.backImage) {
            p.push(n.frontImage)
          }
          return [...p]
        }, [])
        setIdx(0)
        return res.data
      }),
  })

  useEffect(() => {
    if (idx > -1) {
      const randomImgs = shuffle(imagesOfCard.current)

      const answers = randomImgs.slice(0, 3)
      answers.push(cards?.data?.[idx]?.backImage)
      setAnswers(shuffle(answers))
    }
  }, [idx])

  const changeIdx = (link) => () => {
    if (link === cards?.data?.[idx]?.backImage) {
      alert.success('Correct answer')
    } else {
      alert.error('Wrong answer')
    }
    setIdx((s) => s + 1)
  }

  return (
    <>
      <div onClick={onOpen}>{children}</div>
      <Modal
        isOpen={isOpen}
        size='5xl'
        onOpenChange={onOpenChange}
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'></ModalHeader>
              <ModalBody>
                {cards.isLoading && (
                  <div className='flex h-80 w-full flex-col items-center justify-center'>
                    <Spinner size={60} />
                  </div>
                )}
                {idx > -1 && (
                  <Cards
                    ref={refCards}
                    flashsetId={id}
                    data={cards?.data}
                    onClose={onClose}
                  />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
