export function ApiSuccess (success: boolean, object = {}, message: string) {
  return {
    success,
    data: object,
    message,
  };
};