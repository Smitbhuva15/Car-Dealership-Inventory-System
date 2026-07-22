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


