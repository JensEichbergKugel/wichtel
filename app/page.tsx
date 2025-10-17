'use client';

import Image from 'next/image';
import { useState } from 'react';
import { createParticpant } from './action';

export default function Home() {

  const names = ['Alfred', 'Karin', 'Simon', 'Thorsten', 'Jens', 'Kristina', 'Nicole', 'Vanessa'];
  const [email, setEmail] = useState('');
  const [name, setName] = useState(names[0]);
  const [wish, setWish] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('wish', wish);

    try {
      await createParticpant(formData);
      setStatus('success');
      setName("");
      setEmail("");
      setWish("");
    } catch (err: unknown) {
      setStatus('error');

      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Ein unbekannter Fehler ist aufgetreten.');
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-12">
      <Image src="/wichtel.png" alt="Titelbild" width={400} height={300} className='shadow-2xl'></Image>
      <h1 className="rounded-lg text-center mx-6">
        In den geheimen Werkstätten des Nordpols herrscht geschäftiges Treiben: Die kleinen Wichtel-Elfen sitzen schon aufgeregt an ihren funkelnden Tischen und warten nur darauf, deinen perfekten Wichtelpartner auszuwählen.
        Mit glitzernden Mützen und warmem Kakao in der Hand stöbern sie durch die Wunschlisten, vergleichen Persönlichkeiten und zaubern magische Kombinationen – damit dein Wichtelabenteuer dieses Jahr ganz besonders wird.
        Mach mit und lass die Elfen ihre Magie entfalten – dein Wichtelpartner wartet schon!
      </h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label className="block mb-1 font-medium">Wähle deinen Namen:</label>
          <select
            value={name}
            name='name'
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
          >
            {names.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">E-Mail-Adresse</label>
          <input
            type="email"
            name='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full rounded px-3 py-2 border ${email && !isEmailValid
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 dark:border-gray-700 focus:border-blue-500 focus:ring-blue-200'
              }`}

            placeholder="deine@email.de"
          />
          {email && !isEmailValid && (
            <p className="text-red-600 text-sm mt-1">Bitte gib eine gültige E-Mail-Adresse ein.</p>
          )}       </div>
        <div>

          <label className="block mb-1 font-medium">Dein Wunsch</label>
          <textarea
            id="message"
            name="wish"
            rows={5}
            onChange={(e) => setWish((e.target.value))}
            placeholder="Schreibe deine Nachricht hier..."
            className="w-full rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 shadow-sm p-4 text-gray-800 placeholder-gray-400 resize-none transition duration-200 ease-in-out"></textarea>
        </div>

        <button
          type="submit"
          disabled={!isEmailValid || !name}
          className={`w-full font-semibold py-2 px-4 rounded ${!isEmailValid || !name ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
        >
          Absenden
        </button>
        {status === 'success' && (
          <p className="text-green-600 mt-4">🎉 Vielen Dank! Die Wichtel-Elfen basteln schon an deinem Geschenk!</p>
        )}
        {status === 'error' && (
          <p className="text-red-600 mt-4">❌ Das hat nicht funktionert. Jens hat Weihnachten versaut! </p>
        )}     </form >
    </div >
  );
}
