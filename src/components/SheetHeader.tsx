import React from 'react'
import { Sheet } from 'react-modal-sheet'

interface SheetHeaderProps {
  onClose?: React.MouseEventHandler<HTMLDivElement>
  title?: string
  subtitle?: string
}

export default function SheetHeader({ onClose, title, subtitle }: SheetHeaderProps) {
  return (
    <Sheet.Header>
      <div className={'m-auto my-2 h-1 w-[35px]'} />
      <div className={'flex items-center justify-between px-4 py-2.5 leading-6'}>
        <div onClick={onClose} className={'flex items-center justify-center text-[20px]'}>
          <iconpark-icon name="Widget-xiangxiashouqi" />
        </div>
        {
          <div className={'flex flex-col items-center'}>
            <p className={'text-navy text-base22'}>{title}</p>
            {!!subtitle && <div className={'text-b40 leading-[22px]'}>{subtitle}</div>}
          </div>
        }
        <div className={'h-6 w-6'}></div>
      </div>
    </Sheet.Header>
  )
}
