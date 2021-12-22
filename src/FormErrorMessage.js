import { ErrorMessage } from '@hookform/error-message';

export function FormErrorMessage({ errors, name, className }) {
    return (
        <ErrorMessage
            errors={errors}
            name={name}
            render={({ message }) => <p className={`text-sm font-semibold text-rose-600 ${className}`}>{message}</p>}
        />
    );
}
