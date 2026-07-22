export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user?: User;
  error?: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  error?: string;
}

export interface Vehicle {
  _id: string;
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface VehiclePayload {
  make: string;
  model: string;
  category: string;
  price: number;
  quantity: number;
}

export interface SearchFilters {
  make?: string;
  model?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
}

// Auth API Calls
export const registerUser = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Registration failed.');
  }

  return responseData;
};

export const loginUser = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Login failed.');
  }

  return responseData;
};

// Vehicle API Calls
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  let response = await fetch('/api/vehicles/view-all', {
    method: 'GET',
    credentials: 'include',
  });

  if (response.status === 404) {
    response = await fetch('/api/vehicles', {
      method: 'GET',
      credentials: 'include',
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to fetch vehicles.');
  }

  return Array.isArray(responseData) ? responseData : responseData.vehicles || [];
};

export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const vehicles = await getAllVehicles();
  const vehicle = vehicles.find((v) => v._id === id);
  if (!vehicle) {
    throw new Error('Vehicle not found.');
  }
  return vehicle;
};

export const addVehicle = async (data: VehiclePayload): Promise<{ message: string; data?: Vehicle }> => {
  let response = await fetch('/api/vehicles/add', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 404) {
    response = await fetch('/api/vehicles', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to add vehicle.');
  }

  return responseData;
};

export const updateVehicle = async (
  id: string,
  data: Partial<VehiclePayload>
): Promise<{ message: string; vehicle?: Vehicle }> => {
  let response = await fetch(`/api/vehicles/update/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (response.status === 404) {
    response = await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to update vehicle.');
  }

  return responseData;
};

export const deleteVehicle = async (id: string): Promise<{ message: string }> => {
  let response = await fetch(`/api/vehicles/delete/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (response.status === 404) {
    response = await fetch(`/api/vehicles/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to delete vehicle.');
  }

  return responseData;
};

export const restockVehicle = async (id: string, quantity: number): Promise<{ message: string; vehicle?: Vehicle }> => {
  let response = await fetch(`/api/vehicles/restock/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (response.status === 404) {
    response = await fetch(`/api/vehicles/${id}/restock`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to restock vehicle.');
  }

  return responseData;
};

export const purchaseVehicle = async (id: string, quantity: number): Promise<{ message: string; vehicle?: Vehicle }> => {
  let response = await fetch(`/api/vehicles/purchase/${id}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quantity }),
  });

  if (response.status === 404) {
    response = await fetch(`/api/vehicles/${id}/purchase`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity }),
    });
  }

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Failed to purchase vehicle.');
  }

  return responseData;
};

export const searchVehiclesApi = async (filters: SearchFilters): Promise<Vehicle[]> => {
  const queryParams = new URLSearchParams();

  if (filters.make && filters.make.trim()) {
    queryParams.append('make', filters.make.trim());
  }
  if (filters.model && filters.model.trim()) {
    queryParams.append('model', filters.model.trim());
  }
  if (filters.category && filters.category.trim() && filters.category !== 'All') {
    queryParams.append('category', filters.category.trim());
  }
  if (filters.minPrice !== undefined && filters.minPrice !== '') {
    queryParams.append('minPrice', filters.minPrice.toString());
  }
  if (filters.maxPrice !== undefined && filters.maxPrice !== '') {
    queryParams.append('maxPrice', filters.maxPrice.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/api/vehicles/search?${queryString}` : '/api/vehicles/view-all';

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  const responseData = await response.json();

  if (response.status === 404) {
    // 404 returned by backend search endpoint when 0 vehicles match filter
    return [];
  }

  if (!response.ok) {
    throw new Error(responseData.error || responseData.message || 'Search failed.');
  }

  return Array.isArray(responseData) ? responseData : responseData.vehicles || [];
};
