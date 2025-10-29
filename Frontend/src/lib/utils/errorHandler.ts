export class ApiError extends Error {
  status: number;
  errors: any;

  constructor(message: string, status: number, errors?: any) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export const handleApiError = (error: any) => {
  if (error.response) {
    throw new ApiError(
      error.response.data.message || 'An error occurred',
      error.response.status,
      error.response.data.errors
    );
  } else if (error.request) {
    throw new Error('No response from server. Please check your connection.');
  } else {
    throw new Error(error.message || 'An unexpected error occurred');
  }
};
