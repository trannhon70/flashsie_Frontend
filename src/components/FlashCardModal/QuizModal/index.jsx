'use client'
import React, { useEffect, memo, useState, useCallback, useRef } from 'react'

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Spinner,
} from '@nextui-org/react'
import * as flashsetsAPI from '~/apis/flashsets'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import Cards from './Cards'

export default function LearnModal({ children }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const { id } = useParams()

    const [perPage, setPerPage] = useState(200)
    const [page, setPage] = useState(1)
    const [idx, setIdx] = useState(0)

    const cards = useQuery({
        enabled: isOpen,
        queryKey: ['flashset-cards', id, page, perPage],
        queryFn: () =>
            flashsetsAPI.getFlashcards({ id, page, perPage }).then(res => {
                return res.data
            }),
    })

    return (
        <>
            <div onClick={onOpen}>{children}</div>
            <Modal isOpen={isOpen} size='5xl' onOpenChange={onOpenChange} isDismissable={false}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'></ModalHeader>
                            <ModalBody>
                                {cards.isLoading ? (
                                    <div className='flex h-80 w-full flex-col items-center justify-center'>
                                        <Spinner size={60} />
                                    </div>
                                ) : (
                                    <Cards flashsetId={id} data={cards?.data} onClose={onClose} />
                                )}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}
