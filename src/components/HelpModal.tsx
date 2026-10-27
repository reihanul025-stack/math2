import React from 'react';
import { X } from 'lucide-react';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  onStartAdventure: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ open, onClose, onStartAdventure }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <p className="text-xs font-medium text-blue-600">Panduan Singkat</p>
            <h2 id="help-modal-title" className="font-display text-xl font-bold text-slate-900">
              Cara Bermain Math Adventure
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Tutup panduan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ol className="my-5 space-y-3.5 text-sm text-slate-600 leading-relaxed">
          <li>
            <strong className="font-semibold text-slate-900">1. Pilih Dunia Bertahap:</strong>{' '}
            Mulailah dari Dunia 1 (Hutan Perkalian). Setiap dunia yang berhasil ditamatkan akan
            membuka kunci dunia berikutnya.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">2. Lempar Dadu:</strong> Tekan tombol{' '}
            <em>Lempar Dadu</em> (atau tombol <em>Spasi</em> pada papan ketik) untuk menggerakkan
            pion Kiko melintasi petak 0 sampai 24.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">3. Jawab Petak Tantangan:</strong> Saat
            berhenti di petak soal, hitung dengan teliti untuk memperoleh bintang dan membaca
            pembahasan konsepnya.
          </li>
          <li>
            <strong className="font-semibold text-slate-900">4. Petak Bintang &amp; Kejutan:</strong>{' '}
            Petak Bintang memberi tambahan +2 bintang langsung, sedangkan Kotak Kejutan memberimu
            bonus langkah maju atau peti harta karun bintang!
          </li>
          <li>
            <strong className="font-semibold text-slate-900">5. Capai Garis Finish:</strong> Tiba di
            petak ke-24 untuk meraih bonus +5 bintang juara dan membuka dunia baru.
          </li>
        </ol>

        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap"
          >
            Tutup
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onStartAdventure();
            }}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors whitespace-nowrap"
          >
            Saya Paham, Ayo Main
          </button>
        </div>
      </div>
    </div>
  );
};
