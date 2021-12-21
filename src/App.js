import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { validatePesel } from './validatePesel';
import { validateNip } from './validateNip';

// TODO:
// * walidacja aspect ratio 1:1
// * odinstalować fns
// * wygląd
// * strzelanie na odpowiedni adres po submicie POSTem

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
    const onSubmit = (data) => console.log(data);

    const [type, setType] = useState('natural-person');
    const acceptedFileExtension = ['.jpg', '.jpeg'];
    const [selectedFile, setSelectedFile] = useState();

    const peselPattern = /^[0-9]{11}$/;
    const nipPattern = /^[0-9]{10}$/;

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-slate-300">
            <header>
                <h1>Stwórz kontraktora</h1>
            </header>
            <main>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                    <label htmlFor="firstname">Imię</label>
                    <input type="text" id="firstname" {...register('firstname', { required: true })} />
                    {errors.firstname && 'Imię jest wymagane'}

                    <label htmlFor="lastname">Nazwisko</label>
                    <input type="text" id="lastname" {...register('lastname', { required: true })} />
                    {errors.firstname && 'Nazwisko jest wymagane'}

                    <div>
                        <div>Typ</div>
                        <input
                            type="radio"
                            id="natural-person"
                            {...register('type', {
                                onChange: (e) => setType(e.target.value),
                            })}
                            value="natural-person"
                        />
                        <label htmlFor="natural-person">Osoba fizyczna</label>

                        <input type="radio" id="company" {...register('type')} value="company" />
                        <label htmlFor="company">Firma</label>
                    </div>
                    <label htmlFor="taxNumber">{type === 'natural-person' ? 'PESEL' : 'NIP'}</label>
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
                    />
                    <p>{errors.taxNumber ? errors.taxNumber.message : null}</p>

                    <label htmlFor="photo">Zdjęcie (w formacie .jpg lub .jpeg)</label>
                    <input
                        type="file"
                        id="photo"
                        {...register('photo', {
                            validate: {
                                extension: (value) =>
                                    acceptedFileExtension.includes('.' + value[0].name.split('.')[1]) ||
                                    'Zły format zdjęcia',
                                aspectRatio: (value) => console.log(value),
                            },
                            onChange: (e) => setSelectedFile(e.target.files[0]),
                        })}
                        accept={acceptedFileExtension.join(', ')}
                    />
                    <p>{errors.photo ? errors.photo.message : null}</p>

                    {selectedFile ? (
                        <img src={URL.createObjectURL(selectedFile)} alt="" className="max-w-xs max-h-xs" />
                    ) : null}

                    <button type="submit">Zapisz</button>
                </form>
            </main>
        </div>
    );
}

export default App;
