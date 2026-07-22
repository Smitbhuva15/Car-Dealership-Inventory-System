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


export interface RegisterResponse {
  message: string;
  user?: User;
  error?: string;
}

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

