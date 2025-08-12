// components/address/AddressPicker.tsx
'use client';
import { useState } from 'react';
import DaumPostcode, { Address } from 'react-daum-postcode';
import { Modal } from 'antd';

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (addr: string, zonecode: string) => void;
};

export default function AddressPicker({ open, onClose, onSelect }: Props) {
    const handleComplete = (data: Address) => {
        let fullAddress = data.address;
        let extra = '';
        if (data.addressType === 'R') {
            if (data.bname) extra += data.bname;
            if (data.buildingName) extra += (extra ? ', ' : '') + data.buildingName;
            if (extra) fullAddress += ' ' + extra;
        }
        onSelect(fullAddress, data.zonecode);
        onClose();
    };

    return (
        <Modal open={open} onCancel={onClose} footer={null} title="주소 검색">
            <DaumPostcode onComplete={handleComplete} />
        </Modal>
    );
}
