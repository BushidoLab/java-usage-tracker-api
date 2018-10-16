import { createError } from 'apollo-errors';

export const errorHandler = (name, { message, data }) => {
    const error = createError(name, { message, data });
    throw new error;
};
