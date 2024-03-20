'use client'
import QrReaderModal from '@/components/common/QrReaderModal'
import { alert } from '@/utils/helpers'
import {
  Button,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from '@nextui-org/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useCallback, useMemo, useState } from 'react'
import {
  AiFillDelete,
  AiFillEdit,
  AiOutlinePlus
} from 'react-icons/ai'

import * as courseAPI from '@/apis/courses'
import * as userAPI from '@/apis/user'
import constants from '@/utils/constants'
import { useParams } from 'next/navigation'

const columns = [
  // { name: 'No.', uid: 'name' },
  { name: constants.column_name, uid: 'name' },
  { name: constants.column_createdate, uid: 'createdAt' },
  { name: constants.column_point, uid: 'point' },
  { name: constants.column_status, uid: 'status' },
  { name: constants.column_action, uid: 'actions' },
]

const CourseDetail = () => {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [perPage, setPerPage] = useState(10)

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  const course = useQuery({
    queryKey: ['my-students', page, perPage],
    queryFn: () =>
      courseAPI.getStudents(id, { page, perPage }).then((res) => {
        setTotal(res.total)
        return res.data
      }),
  })

  const pages = Math.ceil(total / perPage) || 1

  const handleDel = (studentId) => () => {
    alert.deleteComfirm({
      onDelete: () =>
        courseAPI
          .delStudent(id, studentId)
          .then(() => queryClient.refetchQueries(['course-students', id])),
    })
  }

  const renderCell = useCallback((user, columnKey) => {
    const cellValue = user[columnKey]

    switch (columnKey) {
      case 'name':
        return (
          <User
            avatarProps={{ radius: 'lg', src: user.avatar }}
            description={user.email}
            name={user.name}
          >
            {user.name}
          </User>
        )
      case 'status':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize text-default-400'>
              {user.status}
            </p>
          </div>
        )
      case 'createdAt':
        return (
          <div className='flex flex-col'>
            {/* <p className='text-bold text-sm capitalize'>{cellValue}</p> */}
            <p className='text-bold text-sm capitalize text-default-400'>
              {dayjs(user.createdAt).format(constants.format_date)}
            </p>
          </div>
        )
      case 'point':
        return (
          <div className='flex flex-col'>
            <p className='text-bold text-sm capitalize'>{user.point}</p>
          </div>
        )
      // case 'status':
      //   return (
      //     <Chip
      //       className='capitalize'
      //       color={statusColorMap[course.status]}
      //       size='sm'
      //       variant='flat'
      //     >
      //       {cellValue}
      //     </Chip>
      //   )
      case 'actions':
        return (
          <div className='relative flex items-center gap-2'>
            <Tooltip content='Edit user'>
              <Link href={`#`}>
                <span className='cursor-pointer text-lg text-default-400 active:opacity-50'>
                  <AiFillEdit />
                </span>
              </Link>
            </Tooltip>
            <Tooltip color='danger' content='Delete user'>
              <span
                className='cursor-pointer text-lg text-danger active:opacity-50'
                onClick={handleDel(user.id)}
              >
                <AiFillDelete />
              </span>
            </Tooltip>
          </div>
        )
      default:
        return cellValue
    }
  }, [])

  const onRowsPerPageChange = useCallback((e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1)
    }
  }, [page, pages])

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1)
    }
  }, [page])

  const onQrResult = (courseId) => (code) => {
    userAPI.get(code).then(async (user) => {
      try {
        const { isConfirmed } = await alert.confirm(
          user.name,
          `Do you want add ${user.name} to course?`
        )
        if (isConfirmed)
          await courseAPI.addStudent(courseId, user.id, 'pending')
        alert.success('Student has been added to course successfully!')
      } catch (error) {
        alert.error('Failed to add student!')
      }
    })
  }

  const topContent = useMemo(() => {
    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-end justify-between gap-3'>
          <div className='w-full sm:max-w-[44%]' />
          {/* <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          /> */}
          <div className='flex gap-3'>
            {/* <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown> */}
            <QrReaderModal onResult={onQrResult(course.id)}>
              <Button color='primary' startContent={<AiOutlinePlus />}>
                Add Student
              </Button>
            </QrReaderModal>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-small text-default-400'>Total {total}</span>
          <label className='flex items-center text-small text-default-400'>
            Rows per page:
            <select
              value={`${perPage}`}
              className='bg-transparent text-small text-default-400 outline-none'
              onChange={onRowsPerPageChange}
            >
              <option value='10'>10</option>
              <option value='20'>20</option>
              <option value='50'>50</option>
              <option value='100'>100</option>
            </select>
          </label>
        </div>
      </div>
    )
  }, [total, onRowsPerPageChange])

  const bottomContent = useMemo(() => {
    return (
      <div className='flex items-center justify-between px-2 py-2'>
        <div className='w-[30%]' />
        {/* <span className='w-[30%] text-small text-default-400'>
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
        <Pagination
          isCompact
          showControls
          showShadow
          color='primary'
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className='hidden w-[30%] justify-end gap-2 sm:flex'>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size='sm'
            variant='flat'
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    )
  }, [page, pages])

  return (
    <div className='w-full'>
      <Table
        aria-label=''
        className='mt-4'
        isHeaderSticky
        topContent={topContent}
        topContentPlacement='outside'
        bottomContent={bottomContent}
        bottomContentPlacement='outside'
        classNames={{
          wrapper: 'max-h-[512px]',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={course.data || []}
          emptyContent={course.isLoading || 'No data to display.'}
          isLoading={course.isLoading}
          loadingContent={<Spinner label='Loading...' />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default CourseDetail
