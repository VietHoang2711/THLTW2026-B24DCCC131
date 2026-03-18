import React from 'react';
import { Calendar, Badge, Tooltip } from 'antd';
import type { CalendarProps } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { LichHen } from '@/models/dichvu';

interface LichHenCalendarProps {
  lichHens: LichHen[];
  onSelectDate?: (date: Dayjs) => void;
}

export default function LichHenCalendar({
  lichHens,
  onSelectDate,
}: LichHenCalendarProps) {

  // 📌 Lấy danh sách lịch theo ngày
  const getListData = (value: Dayjs) => {
    return lichHens.filter((lh) =>
      dayjs(lh.ngayHen).isSame(value, 'day')
    );
  };

  // 📌 Map trạng thái → màu Badge
  const getStatus = (status: string) => {
    switch (status) {
      case 'hoan_thanh':
        return 'success';
      case 'xac_nhan':
        return 'processing';
      case 'huy':
        return 'error';
      default:
        return 'warning';
    }
  };

  // 📌 Render từng ô ngày
  const dateCellRender = (value: Dayjs) => {
    const listData = getListData(value);

    return (
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: 60,
          overflowY: 'auto',
        }}
      >
        {listData.map((item) => (
          <li key={item.id}>
            <Tooltip title={`${item.khachHangTen} - ${item.thoiGianBatDau}`}>
              <Badge
                status={getStatus(item.trangThai)}
                text={
                  <span
                    style={{
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                    }}
                  >
                    {item.khachHangTen}
                  </span>
                }
              />
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  };

  // ✅ Fix đúng chuẩn typing của antd
  const onSelect: CalendarProps<Dayjs>['onSelect'] = (date) => {
    onSelectDate?.(date);
  };

  return (
    <Calendar
      cellRender={(current) => dateCellRender(current as Dayjs)}
      onSelect={onSelect}
      fullscreen={false}
    />
  );
}