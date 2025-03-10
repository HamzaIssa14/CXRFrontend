import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

interface LoginResponse {
  accessToken: string;
}

interface RegisterResponse {
  message: string;
}

interface ModelAnalysisResponse {
  result: string;
}

interface ModelDetailsResponse {
  id: number;
  name: string;
  description: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    });

    // ✅ Add request interceptor for JWT token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Add response interceptor to handle expired JWT tokens
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 401) {
          console.warn("Unauthorized! Logging out...");
          this.logout();
          window.location.href = "/login"; // Redirect user to login
        }
        return Promise.reject(error);
      }
    );
  }

  // 🔹 **AUTH ENDPOINTS**

  async login(credentials: { usernameOrEmail: string; password: string }): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', credentials);
      const token = response.data.accessToken;
  
      if (token) {
        localStorage.setItem('token', token); // ✅ Store JWT token
      }
  
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  }

  async register(userData: { username: string; email: string; password: string }): Promise<RegisterResponse> {
    try {
      const response = await this.api.post<RegisterResponse>('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      throw error;
    }
  }

  logout(): void {
    console.log("Executing logout...");
  
    // ✅ Remove token from local storage
    localStorage.removeItem("token");
    console.log("Token removed from local storage:", localStorage.getItem("token")); // Should be null
  
    // ✅ Remove JWT from Axios headers
    delete this.api.defaults.headers.common["Authorization"];
    console.log("Authorization header removed from Axios");
  
    // ✅ Redirect user to login
    window.location.href = "/login";
  }

  // 🔹 **MODEL ENDPOINTS**

  async analyzeImage(modelId: number, imageFile: File): Promise<ModelAnalysisResponse> {
    try {
      console.log("Now attemmpting to upload image to flask api")
        const formData = new FormData();
        formData.append('file', imageFile);  // ✅ Use 'file' as Flask expects
        
        const token = localStorage.getItem('token'); // ✅ Ensure token is included
        const response = await this.api.post<ModelAnalysisResponse>(
            `http://localhost:5001/predict`,  // ✅ Direct call to Flask API
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ""  // ✅ Explicitly add JWT token
                }
            }
        );
      console.log("Successfully receives a response from the flask api")
        return response.data;
    } catch (error) {
        console.error("Image analysis failed:", error.response?.data || error.message);
        throw error;
    }
}


  async getModelDetails(modelId: number): Promise<ModelDetailsResponse> {
    try {
      const response = await this.api.get<ModelDetailsResponse>(`/models/${modelId}`);
      return response.data;
    } catch (error) {
      console.error("Fetching model details failed:", error.response?.data || error.message);
      throw error;
    }
  }
}

export default new ApiService();
