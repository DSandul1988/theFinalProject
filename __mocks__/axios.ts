// __mocks__/axios.ts
const mockAxios = jest.createMockFromModule("axios") as any;

// Mock implementation for axios
mockAxios.create = jest.fn(() => mockAxios);

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Mock methods
mockAxios.get.mockResolvedValue({ data: {} });
mockAxios.post.mockResolvedValue({ data: {} });
mockAxios.put.mockResolvedValue({ data: {} });
mockAxios.delete.mockResolvedValue({ data: {} });
mockAxios.patch.mockResolvedValue({ data: {} });
mockAxios.head.mockResolvedValue({ data: {} });
mockAxios.options.mockResolvedValue({ data: {} });

// Export this mock instead of the original axios
export default mockAxios;
