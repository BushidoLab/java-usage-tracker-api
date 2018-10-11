import { createError } from 'apollo-errors';

export const errorHandler = (name, { message, data }) => {
    const Error = createError(name, { message, data });
    throw new Error;
}