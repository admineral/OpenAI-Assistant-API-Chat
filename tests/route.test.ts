import { GET } from '../app/api/listAssistants/route';

describe('GET /api/listAssistants', () => {
    it('responds with json', async () => {
        const mockReq = {}; // No need to cast to NextRequest if you're not using any properties from it
        const response = await GET(mockReq as any);
      
        // Add more assertions based on your needs
        expect(response).toHaveProperty('json');
        const jsonData = await response.json();
        expect(jsonData).toHaveProperty('assistants');
        expect(typeof jsonData.assistants).toBe('object');
        expect(jsonData.assistants).toHaveProperty('data');
      });
});


