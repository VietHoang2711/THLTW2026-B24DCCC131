import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Select, Rate, InputNumber, Empty } from 'antd';
import { DEFAULT_DESTINATIONS } from '../../models/travel/destinations';

const { Meta } = Card;

const types = [
  { label: 'Tất cả', value: '' },
  { label: 'Biển', value: 'beach' },
  { label: 'Núi', value: 'mountain' },
  { label: 'Thành phố', value: 'city' },
];

const FALLBACK_IMAGE = 'https://via.placeholder.com/1200x600?text=No+image';

export default function Discover(): JSX.Element {
  const [filterType, setFilterType] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [minRating, setMinRating] = useState<number>(0);

  const list = useMemo(() => {
    return DEFAULT_DESTINATIONS.filter((d) => {
      if (filterType && d.type !== filterType) return false;
      if (minPrice != null && d.price < minPrice) return false;
      if (d.rating < minRating) return false;
      return true;
    });
  }, [filterType, minPrice, minRating]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 12, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Select
          style={{ width: 160 }}
          value={filterType}
          onChange={(v) => setFilterType(v)}
          options={types}
        />
        <InputNumber
          placeholder="Giá tối thiểu"
          min={0}
          onChange={(v) => setMinPrice(v as any)}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Đánh giá tối thiểu</span>
          <Rate allowHalf defaultValue={0} value={minRating} onChange={(v) => setMinRating(v)} />
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {list.length === 0 && (
          <Col span={24}>
            <Empty description="Không có điểm đến" />
          </Col>
        )}
        {list.map((d) => (
          <Col xs={24} sm={12} md={8} lg={6} key={d.id}>
            <Card
              hoverable
              cover={
                <img
                  alt={d.title}
                  src={d.image || FALLBACK_IMAGE}
                  style={{ height: 160, objectFit: 'cover', width: '100%' }}
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    if (img && img.src !== FALLBACK_IMAGE) img.src = FALLBACK_IMAGE;
                  }}
                />
              }
            >
              <Meta title={d.title} description={`Giá: $${d.price}`} />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Rate allowHalf disabled defaultValue={d.rating} />
                <div style={{ fontSize: 12, color: '#666' }}>{d.durationMins / 60}h tham quan</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
