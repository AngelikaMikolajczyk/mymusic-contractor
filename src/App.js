import { useForm } from 'react-hook-form';
import { useRef, useState } from 'react';
import { validatePesel } from './validatePesel';
import { validateNip } from './validateNip';
import { FormErrorMessage } from './FormErrorMessage';

// TODO:
// * walidacja aspect ratio 1:1 - poprawka

function App() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            firstname: '',
            lastname: '',
            type: 'natural-person',
            taxNumber: '',
            photo: [],
        },
    });

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('firstname', data.firstname);
        formData.append('lastname', data.lastname);
        formData.append('type', data.type);
        formData.append('taxNumber', data.taxNumber);
        formData.append('photo', data.photo[0]);

        await fetch('/Contractor/Save', {
            method: 'post',
            body: formData,
        });

        alert('Nie znaleziono metody zapisu');
    };

    const [type, setType] = useState('natural-person');
    const acceptedFileExtension = ['.jpg', '.jpeg'];
    const [selectedFile, setSelectedFile] = useState();

    const peselPattern = /^[0-9]{11}$/;
    const nipPattern = /^[0-9]{10}$/;

    const photoRef = useRef();

    return (
        <div className="flex justify-center items-center bg-sky-100 min-h-screen">
            <div className="max-w-xl w-full bg-slate-50 p-8 flex flex-col gap-6 rounded-xl shadow-2xl border my-8">
                <header>
                    <h1 className="text-sky-600 font-bold text-center text-2xl">Nowy kontrahent</h1>
                </header>
                <main className="text-lg p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <label htmlFor="firstname" className="font-semibold flex flex-col">
                            Imię
                            <input
                                type="text"
                                id="firstname"
                                {...register('firstname', { required: 'Imię jest wymagane' })}
                                className="p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                            />
                            <FormErrorMessage errors={errors} name="firstname" className="mt-1" />
                        </label>

                        <label htmlFor="lastname" className="font-semibold flex flex-col">
                            Nazwisko
                            <input
                                type="text"
                                id="lastname"
                                {...register('lastname', { required: 'Nazwisko jest wymagane' })}
                                className="p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                            />
                            <FormErrorMessage errors={errors} name="lastname" className="mt-1" />
                        </label>

                        <div>
                            <div className="font-semibold">Typ</div>
                            <div className="flex gap-20">
                                <div className="flex gap-2 items-baseline">
                                    <input
                                        type="radio"
                                        id="natural-person"
                                        {...register('type', {
                                            onChange: (e) => setType(e.target.value),
                                        })}
                                        value="natural-person"
                                        className="focus:outline-none focus:ring-2 focus:ring-sky-600 focus:rounded"
                                    />
                                    <label htmlFor="natural-person">Osoba fizyczna</label>
                                </div>

                                <div className="flex gap-2 items-baseline">
                                    <input
                                        type="radio"
                                        id="company"
                                        {...register('type')}
                                        value="company"
                                        className="focus:outline-none focus:ring-2 focus:ring-sky-600 focus:rounded"
                                    />
                                    <label htmlFor="company">Firma</label>
                                </div>
                            </div>
                        </div>

                        <label htmlFor="taxNumber" className="font-semibold flex flex-col">
                            {type === 'natural-person' ? 'PESEL' : 'NIP'}

                            <input
                                type="text"
                                id="taxNumber"
                                {...register('taxNumber', {
                                    pattern: {
                                        value: type === 'natural-person' ? peselPattern : nipPattern,
                                        message: `Niepoprawny numer ${type === 'natural-person' ? 'PESEL' : 'NIP'}`,
                                    },
                                    validate: {
                                        correctness: (value) =>
                                            type === 'natural-person'
                                                ? validatePesel(value) || 'Niepoprawny numer PESEL'
                                                : validateNip(value) || 'Niepoprawny numer NIP',
                                    },
                                    required: `Numer ${type === 'natural-person' ? 'PESEL' : 'NIP'} jest wymagany`,
                                })}
                                className="p-2 border rounded-md border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-600"
                            />

                            <FormErrorMessage errors={errors} name="taxNumber" className="mt-1" />
                        </label>

                        <label htmlFor="photo" className="font-semibold">
                            Zdjęcie <span className="font-thin text-base">(kwadrat, w formacie .jpg lub .jpeg)</span>
                        </label>
                        <input
                            type="file"
                            id="photo"
                            {...register('photo', {
                                required: 'Zdjęcie jest wymagane',
                                validate: {
                                    extension: (value) =>
                                        acceptedFileExtension.includes('.' + value[0].name.split('.')[1]) ||
                                        'Zły format zdjęcia',
                                    aspectRatio: () =>
                                        photoRef.current.naturalWidth / photoRef.current.naturalHeight === 1 ||
                                        'Zdjęcie musi być w kwadracie',
                                },
                                onChange: (e) => setSelectedFile(e.target.files[0]),
                            })}
                            accept={acceptedFileExtension.join(', ')}
                            className="text-base text-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:rounded"
                        />
                        <FormErrorMessage errors={errors} name="photo" />

                        {selectedFile ? (
                            <img
                                src={URL.createObjectURL(selectedFile)}
                                alt=""
                                className="max-w-xxs mx-auto my-4 ring ring-sky-700"
                                ref={photoRef}
                            />
                        ) : null}

                        <button
                            type="submit"
                            className="mx-auto bg-gradient-to-b from-sky-500 to-sky-700 text-sky-50 rounded-xl text-xl font-bold py-3 px-10 focus:outline-none focus:ring-2 focus:ring-sky-800"
                        >
                            Zapisz
                        </button>
                    </form>
                </main>
            </div>
        </div>
    );
}

export default App;
