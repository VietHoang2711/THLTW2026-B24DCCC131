import React, { useEffect, useState } from 'react';
import { Card, Tabs, Form, Input, InputNumber, Button, List, Select, Tag, Row, Col, message } from 'antd';
import { ExamService } from '../../services/Exam/service';
import { sampleDifficulties } from '../../services/Exam/storage';
import { KnowledgeBlock, Subject, Question, ExamTemplateItem } from '../../services/Exam/types';
import './index.less';

const { TabPane } = Tabs;

const ExamPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [kblocks, setKblocks] = useState<KnowledgeBlock[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setSubjects(ExamService.listSubjects());
    setKblocks(ExamService.listKnowledgeBlocks());
    setQuestions(ExamService.listQuestions());
  }, []);

  const addSubject = (values: any) => {
    const newS: Subject = { id: `s_${Date.now()}`, code: values.code || '', name: values.name, credits: values.credits || 0 };
    const next = [...subjects, newS];
    ExamService.saveSubjects(next);
    setSubjects(next);
    message.success('Lưu môn học');
  };

  const addKB = (values: any) => {
    const newK: KnowledgeBlock = { id: `k_${Date.now()}`, name: values.name, description: values.description };
    const next = [...kblocks, newK];
    ExamService.saveKnowledgeBlocks(next);
    setKblocks(next);
    message.success('Lưu khối kiến thức');
  };

  const addQuestion = (values: any) => {
    const newQ: Question = { id: `q_${Date.now()}`, subjectId: values.subjectId, content: values.content, difficulty: values.difficulty, knowledgeBlockIds: values.kbIds || [] };
    const next = [newQ, ...questions];
    ExamService.saveQuestions(next);
    setQuestions(next);
    message.success('Lưu câu hỏi');
  };

  const [templateItems, setTemplateItems] = useState<ExamTemplateItem[]>([]);
  const addTemplateItem = (item: ExamTemplateItem) => setTemplateItems((s) => [...s, item]);

  const generateAdHoc = (subjectId?: string) => {
    if (!subjectId) return message.error('Chọn môn học');
    try {
      const exam = ExamService.generateExamAdHoc(subjectId, templateItems);
      message.success('Tạo đề xong: ' + exam.id);
    } catch (e: any) {
      message.error(e.message || 'Lỗi');
    }
  };

  return (
    <Card>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Môn học" key="1">
          <Form layout="inline" onFinish={addSubject}>
            <Form.Item name="code" label="Mã">
              <Input />
            </Form.Item>
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="credits" label="Tín chỉ">
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Thêm</Button>
            </Form.Item>
          </Form>

          <List dataSource={subjects} renderItem={(s) => <List.Item>{s.code} - {s.name} ({s.credits} tc)</List.Item>} />
        </TabPane>

        <TabPane tab="Khối kiến thức" key="2">
          <Form layout="inline" onFinish={addKB}>
            <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Thêm</Button>
            </Form.Item>
          </Form>
          <List dataSource={kblocks} renderItem={(k) => <List.Item>{k.name}</List.Item>} />
        </TabPane>

        <TabPane tab="Câu hỏi" key="3">
          <Form layout="vertical" onFinish={addQuestion}>
            <Row gutter={8}>
              <Col span={6}>
                <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
                  <Select allowClear>
                    {subjects.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true }]}>
                  <Select>
                    {sampleDifficulties().map((d) => <Select.Option key={d} value={d}>{d}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="kbIds" label="Khối kiến thức">
                  <Select mode="multiple" allowClear>
                    {kblocks.map((k) => <Select.Option key={k.id} value={k.id}>{k.name}</Select.Option>)}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit">Lưu câu hỏi</Button>
            </Form.Item>
          </Form>

          <List dataSource={questions} renderItem={(q) => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <div><b>{q.content}</b></div>
                <div><Tag>{q.difficulty}</Tag> {q.knowledgeBlockIds.map((id)=> (kblocks.find(k=>k.id===id)||{name:id}).name).join(', ')}</div>
              </div>
            </List.Item>
          )} />
        </TabPane>

        <TabPane tab="Tạo đề" key="4">
          <Form layout="inline" onFinish={(v)=>generateAdHoc(v.subjectId)}>
            <Form.Item name="subjectId" label="Môn học" rules={[{ required: true }]}>
              <Select style={{ width: 220 }}>
                {subjects.map((s) => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Tạo đề từ cấu trúc</Button>
            </Form.Item>
          </Form>

          <div style={{ marginTop: 12 }}>
            <Form layout="inline" onFinish={(v)=> addTemplateItem({ difficulty: v.difficulty, knowledgeBlockId: v.kbId || undefined, count: v.count })}>
              <Form.Item name="difficulty" label="Mức độ" rules={[{ required: true }]}>
                <Select style={{ width: 140 }}>
                  {sampleDifficulties().map(d=> <Select.Option key={d} value={d}>{d}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="kbId" label="Khối" >
                <Select style={{ width: 160 }} allowClear>
                  {kblocks.map(k=> <Select.Option key={k.id} value={k.id}>{k.name}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item name="count" label="Số lượng" initialValue={1}>
                <InputNumber min={1} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit">Thêm mục</Button>
              </Form.Item>
            </Form>

            <div style={{ marginTop: 8 }}>
              {templateItems.map((it, idx)=> <Tag key={idx}>{it.count}×{it.difficulty} ({it.knowledgeBlockId || 'Tất cả'})</Tag>)}
            </div>
          </div>
        </TabPane>

        <TabPane tab="Đề đã tạo" key="5">
          <List dataSource={ExamService.listExams()} renderItem={e=> (
            <List.Item>
              <div>{e.id} — {new Date(e.createdAt).toLocaleString()} — {e.questionIds.length} câu</div>
            </List.Item>
          )} />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default ExamPage;
