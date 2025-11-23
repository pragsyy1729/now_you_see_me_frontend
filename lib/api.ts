import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LayerInfo {
  name: string;
  title: string;
  description: string;
  channels: number;
  size: number;
  position: [number, number, number];
}

export interface ModelInfo {
  architecture: string;
  layers: LayerInfo[];
  total_layers: number;
}

export interface ActivationData {
  type: '1d' | '2d' | 'grid' | 'channel_grid';
  shape: number[];
  data: number[][] | number[];
  num_channels: number;
  sampled_channels?: number[];
  grid_layout?: {
    rows: number;
    cols: number;
    cell_height: number;
    cell_width: number;
  };
}

export interface ProcessImageResponse {
  success: boolean;
  image_preview: string;
  gradcam_overlay?: string;
  activations: { [key: string]: ActivationData };
  predictions: {
    top5_indices: number[];
    top5_probabilities: number[];
    top5_names: string[];
  };
}

class APIService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/api/health`);
      return response.data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  async getModelInfo(): Promise<ModelInfo> {
    try {
      const response = await axios.get(`${this.baseURL}/api/model-info`);
      return response.data;
    } catch (error) {
      console.error('Failed to get model info:', error);
      throw error;
    }
  }

  async processImage(imageFile: File): Promise<ProcessImageResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(
        `${this.baseURL}/api/process-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to process image:', error);
      throw error;
    }
  }

  async getLayerActivation(layerName: string): Promise<{
    layer_name: string;
    activation: ActivationData;
  }> {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/layer-activations/${layerName}`
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to get activation for ${layerName}:`, error);
      throw error;
    }
  }
}

export const apiService = new APIService();
