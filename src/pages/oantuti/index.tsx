import React, { useState } from 'react';
import { Card, Button, List, Tag, Row, Col, Space } from 'antd';
// import './index.less';

type Choice = 'Kéo' | 'Búa' | 'Bao';

type Round = {
  id: number;
  player: Choice;
  computer: Choice;
  result: 'Thắng' | 'Thua' | 'Hòa';
  time: string;
};

const CHOICES: Choice[] = ['Kéo', 'Búa', 'Bao'];

function decide(player: Choice, computer: Choice): 'Thắng' | 'Thua' | 'Hòa' {
  if (player === computer) return 'Hòa';

  // Kéo beats Bao, Búa beats Kéo, Bao beats Búa
  if (
    (player === 'Kéo' && computer === 'Bao') ||
    (player === 'Búa' && computer === 'Kéo') ||
    (player === 'Bao' && computer === 'Búa')
  ) {
    return 'Thắng';
  }

  return 'Thua';
}

const randomChoice = (): Choice => CHOICES[Math.floor(Math.random() * CHOICES.length)];

const OanTuTi: React.FC = () => {
  const [history, setHistory] = useState<Round[]>([]);
  const [lastResult, setLastResult] = useState<Round | null>(null);
  const [nextId, setNextId] = useState(1);

  const play = (playerChoice: Choice) => {
    const comp = randomChoice();
    const result = decide(playerChoice, comp);
    const round: Round = {
      id: nextId,
      player: playerChoice,
      computer: comp,
      result,
      time: new Date().toLocaleTimeString(),
    };

    setNextId((n) => n + 1);
    setHistory((h) => [round, ...h]);
    setLastResult(round);
  };

  const clearHistory = () => {
    setHistory([]);
    setLastResult(null);
    setNextId(1);
  };

  return (
    <Card title="Oẳn Tù Tì" className="oantuti-card">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <div className="oantuti-controls">
            <div className="hint">Chọn: </div>
            <Space>
              {CHOICES.map((c) => (
                <Button key={c} type="primary" onClick={() => play(c)}>
                  {c}
                </Button>
              ))}
            </Space>

            <div className="last-result">
              {lastResult ? (
                <div>
                  <div>
                    Bạn: <b>{lastResult.player}</b> — Máy: <b>{lastResult.computer}</b>
                  </div>
                  <div>
                    Kết quả: <Tag color={lastResult.result === 'Thắng' ? 'green' : lastResult.result === 'Thua' ? 'red' : 'gold'}>{lastResult.result}</Tag>
                  </div>
                </div>
              ) : (
                <div className="muted">Chưa có ván nào</div>
              )}
            </div>

            <div style={{ marginTop: 12 }}>
              <Button onClick={clearHistory}>Xóa lịch sử</Button>
            </div>
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="history">
            <div className="history-title">Lịch sử ván đấu</div>
            <List
              size="small"
              bordered
              dataSource={history}
              locale={{ emptyText: 'Chưa có ván nào' }}
              renderItem={(item) => (
                <List.Item>
                  <div className="history-item">
                    <div className="history-main">
                      <span className="time">{item.time}</span>
                      <span className="players">Bạn {item.player} — Máy {item.computer}</span>
                    </div>
                    <div>
                      <Tag color={item.result === 'Thắng' ? 'green' : item.result === 'Thua' ? 'red' : 'gold'}>{item.result}</Tag>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default OanTuTi;
