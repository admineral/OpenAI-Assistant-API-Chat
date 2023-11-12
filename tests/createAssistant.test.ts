// tests/createAssistant.test.ts
import { POST } from '../app/api/createAssistant/route';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    beta: {
      assistants: {
        create: jest.fn().mockResolvedValue({ id: 'test-id' }),
      },
    },
  })),
}));

describe('POST function', () => {
  it('should return assistantId when valid data is provided', async () => {
    const mockReq = {
      method: 'POST',
      formData: jest.fn().mockResolvedValue({
        get: jest.fn().mockImplementation((param) => {
          switch (param) {
            case 'assistantName':
              return 'test-name';
            case 'assistantModel':
              return 'test-model';
            case 'assistantDescription':
              return 'test-description';
            case 'fileId':
              return 'test-fileId';
            default:
              return null;
          }
        }),
      }),
    } as unknown as NextRequest;

    const response = await POST(mockReq);
    console.log(response); // Print the response

    const jsonResponse = await response.json();
    console.log(jsonResponse); // Print the JSON response

    expect(jsonResponse).toEqual({
      message: 'Assistant created successfully',
      assistantId: 'test-id',
    });
  });
});