'use client'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner, useDisclosure } from '@nextui-org/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { isDesktop } from 'react-device-detect'
import { FaCircleChevronLeft, FaCircleChevronRight } from 'react-icons/fa6'

import Cards from '../components/Cards'

import * as flashsetAPI from '~/apis/flashsets'
import { alert } from '~/utils/helpers'

export default function LearnModalNew({ cards, children, flashsetId, page, perPage, learned }) {
    const queryClient = useQueryClient()
    const { isOpen, onOpen, onClose } = useDisclosure()
    // const [perPage, setPerPage] = useState(5)
    // const [page, setPage] = useState(initPage)
    const refCards = useRef()
    const refBody = useRef(new Date().getTime())

    const isFirst = useRef(true)
    const isFlipped = useRef(false)
    const isListen = useRef(false)

    cards = useQuery({
        enabled: isOpen,
        queryKey: ['flashset-cards', flashsetId, page, perPage],
        queryFn: () =>
            flashsetAPI.getFlashcards({
                id: flashsetId,
                page: 1,
                perPage: 10000,
            }),
    })

    const [index, setIndex] = useState(Number(learned))
    const handleFlip = flashcardId => {
        refBody.current = new Date().getTime()
        isFlipped.current = true
    }

    useEffect(() => {
        if (!isOpen && !isFirst.current) {
            setIndex(learned)
            queryClient.refetchQueries(['flashset', flashsetId])
        }
        isFirst.current = false
        // setIndex(learned)
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keyup', handleKeyPress)
        }
        return () => {
            isOpen && window.removeEventListener('keyup', handleKeyPress)
        }
    }, [isOpen])

    const handleKeyPress = e => {
        if (e.key === 'ArrowRight') handleNext()
        else if (e.key === 'ArrowLeft') handlePrev()
    }

    const handlePrev = () => {
        refCards.current.prev()
    }

    const handleNext = async () => {
        if (!isFlipped.current) {
            alert.error('Please try flipping this card first')
            return
        }
        isListen.current = false
        isFlipped.current = false
        if (learned < cards?.data?.data?.length && index >= learned) {
            flashsetAPI.histories(flashsetId, 'learn', [{ id: flashsetId, result: true }]).then(() => {})
            refCards.current.next()
        }
    }


    const isMobile = () => window?.matchMedia && window?.matchMedia?.('(max-width: 768px)')?.matches

    const handeBody = () => {
        if (!isMobile() || isDesktop) return
        if (new Date().getTime() - refBody.current < 1000) return
    }
    return (
        <>
            <div className='relative cursor-pointer' onClick={onOpen}>
                {children}
                <div className='absolute bottom-0 left-0 right-0 top-0' />
            </div>
            {isOpen && (
                <Modal size='full' isOpen={true} onClose={onClose}>
                    <ModalContent>
                        {onClose => (
                            <>
                                <ModalHeader className='flex flex-col gap-1'>Learn</ModalHeader>
                                <ModalBody onClick={handeBody}>
                                    {cards.isLoading && (
                                        <div className='flex h-80 w-full flex-col items-center justify-center '>
                                            <Spinner size={60} />
                                        </div>
                                    )}

                                    {Array.isArray(cards?.data?.data) && (
                                        <Cards
                                            ref={refCards}
                                            flashsetId={flashsetId}
                                            data={
                                                cards?.data.data.sort((a, b) => {
                                                    const numA = parseInt(a.name.replace('Card ', ''))
                                                    const numB = parseInt(b.name.replace('Card ', ''))
                                                    return numA - numB
                                                })
                                                // .slice(
                                                //     learned ==
                                                //         cards?.data?.total
                                                //         ? index
                                                //         : learned,
                                                //     cards?.data?.data?.length
                                                // )
                                            }
                                            onClose={onClose}
                                            onFlip={handleFlip}
                                            onSpeaked={() => {
                                                isListen.current = true
                                            }}
                                            onIndexChange={e => {
                                                setIndex(
                                                    index < learned
                                                        ? cards?.data?.total == learned
                                                            ? index + 1
                                                            : learned + 1
                                                        : index + 1
                                                )
                                            }}
                                            onIndexChangePrev={e => {
                                                setIndex(index - 1)
                                            }}
                                            // onOutideClick={handleNext}
                                        />
                                    )}

                                    {Array.isArray(cards?.data?.data) && (
                                        <div className='flex flex-row items-center justify-between p-4 font-semibold'>
                                            <Button
                                                // isDisabled={index <= 0}
                                                color='primary'
                                                isIconOnly
                                                variant='light'
                                                onPress={handlePrev}
                                            >
                                                <FaCircleChevronLeft size={30} />
                                            </Button>
                                            <p>
                                                {index < learned ? (index > learned ? 0 : learned) : index}/
                                                {cards?.data?.data?.length}
                                            </p>
                                            {cards?.data?.data?.length == index ? (
                                                <Button color='success' onPress={onClose}>
                                                    Done
                                                </Button>
                                            ) : (
                                                <Button
                                                    isDisabled={cards?.data?.data?.length == index}
                                                    color='primary'
                                                    isIconOnly
                                                    variant='light'
                                                    onPress={handleNext}
                                                >
                                                    <FaCircleChevronRight size={30} />
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            )}
        </>
    )
}
