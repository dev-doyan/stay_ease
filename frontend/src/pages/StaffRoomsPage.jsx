import { useEffect, useState } from 'react';
import { Pencil, Trash2, ImagePlus, Plus, Upload } from 'lucide-react';

import {
  getRooms,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
} from '../api/rooms';

import { uploadRoomImage } from '../api/images';

import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

import {
  formatCurrency,
  formatRoomType,
  ROOM_PLACEHOLDER_IMAGE,
} from '../utils/format';

import { ApiError } from '../api/client';

const emptyForm = {
  roomNumber: '',
  roomType: 'SINGLE',
  description: '',
  pricePerNight: '',
  capacity: '',
};

export default function StaffRoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [uploadRoom, setUploadRoom] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState('');

  const [roomImages, setRoomImages] = useState({});

  const load = () => {
    setLoading(true);

    getRooms()
      .then((data) => setRooms(data.rooms || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (room) => {
    setEditing(room);

    setForm({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      description: room.description || '',
      pricePerNight: String(room.pricePerNight),
      capacity: String(room.capacity),
    });

    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError('');

    const payload = {
      roomNumber: form.roomNumber,
      roomType: form.roomType,
      description: form.description || undefined,
      pricePerNight: Number(form.pricePerNight),
      capacity: Number(form.capacity),
    };

    try {
      if (editing) {
        await updateRoom(editing.id, payload);
      } else {
        await createRoom(payload);
      }

      setFormOpen(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setSaving(true);

    try {
      await deleteRoom(deleteTarget.id);

      setDeleteTarget(null);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Delete failed');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (room, status) => {
    try {
      await updateRoomStatus(room.id, status);
      load();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Status update failed'
      );
    }
  };

  const openUpload = (room) => {
    setUploadRoom(room);
    setUploadFile(null);
    setUploadPreview('');
    setUploadSuccess('');
    setError('');
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      setUploadFile(null);
      setUploadPreview('');
      return;
    }

    setUploadFile(file);
    setUploadSuccess('');
    setError('');

    setUploadPreview(URL.createObjectURL(file));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!uploadRoom || !uploadFile) return;

    setUploadLoading(true);
    setError('');
    setUploadSuccess('');

    try {
      const data = await uploadRoomImage(
        uploadRoom.id,
        uploadFile
      );

      setUploadSuccess(
        'Image uploaded successfully.'
      );

      setRoomImages((prev) => ({
        ...prev,
        [uploadRoom.id]: [
          ...(prev[uploadRoom.id] || []),
          data.image?.imageUrl ||
            data.image?.[0]?.imageUrl,
        ].filter(Boolean),
      }));

      setUploadFile(null);
      setUploadPreview('');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Upload failed'
      );
    } finally {
      setUploadLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading rooms…" />;
  }

  return (
    <div className="space-y-6">

      {/* PAGE HEADER */}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-navy-900">
            Room management
          </h1>

          <p className="text-sm text-charcoal/60">
            Add, edit, and maintain inventory.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" />
          Add room
        </button>
      </div>

      <ErrorMessage message={error} />

      {/* ROOMS */}

      <div className="grid gap-4 lg:grid-cols-2">
        {rooms.map((room) => {
          const images = roomImages[room.id];

          const thumb =
            images?.[images.length - 1] ||
            ROOM_PLACEHOLDER_IMAGE;

          return (
            <div
              key={room.id}
              className="overflow-hidden rounded-xl border border-cream-100 bg-white shadow-sm"
            >
              <div className="flex h-36 bg-navy-900">
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover opacity-90"
                />
              </div>

              <div className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase text-gold-500">
                      Room {room.roomNumber}
                    </p>

                    <h3 className="font-display text-lg text-navy-900">
                      {formatRoomType(room.roomType)}
                    </h3>
                  </div>

                  <StatusBadge status={room.status} />
                </div>

                <p className="mt-2 line-clamp-2 text-sm text-charcoal/70">
                  {room.description || 'No description'}
                </p>

                <p className="mt-2 text-sm font-medium">
                  {formatCurrency(room.pricePerNight)} ·{' '}
                  {room.capacity} guests
                </p>

                <div className="mt-4 flex flex-wrap gap-2">

                  <select
                    value={room.status}
                    onChange={(e) =>
                      handleStatusChange(
                        room,
                        e.target.value
                      )
                    }
                    className="rounded-lg border border-navy-800/10 px-2 py-1.5 text-xs"
                  >
                    <option value="AVAILABLE">
                      Available
                    </option>

                    <option value="OCCUPIED">
                      Occupied
                    </option>
                  </select>

                  <button
                    type="button"
                    onClick={() => openEdit(room)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => openUpload(room)}
                    className="inline-flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-medium"
                  >
                    <ImagePlus className="h-3.5 w-3.5" />
                    Upload image
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget(room)
                    }
                    className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD / EDIT ROOM MODAL */}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit room' : 'Add room'}
        wide
      >
        <form
          onSubmit={handleSave}
          className="grid gap-4 sm:grid-cols-2"
        >

          <label className="text-sm sm:col-span-1">
            Room number

            <input
              required
              value={form.roomNumber}
              onChange={(e) =>
                setForm({
                  ...form,
                  roomNumber: e.target.value,
                })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="text-sm">
            Type

            <select
              value={form.roomType}
              onChange={(e) =>
                setForm({
                  ...form,
                  roomType: e.target.value,
                })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            >
              <option value="SINGLE">
                Single
              </option>

              <option value="DOUBLE">
                Double
              </option>
            </select>
          </label>

          <label className="text-sm">
            Price per night

            <input
              type="number"
              min="0"
              step="0.01"
              required
              value={form.pricePerNight}
              onChange={(e) =>
                setForm({
                  ...form,
                  pricePerNight: e.target.value,
                })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="text-sm">
            Capacity

            <input
              type="number"
              min="1"
              required
              value={form.capacity}
              onChange={(e) =>
                setForm({
                  ...form,
                  capacity: e.target.value,
                })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>

          <label className="text-sm sm:col-span-2">
            Description

            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="mt-1 w-full rounded-lg border px-3 py-2"
            />
          </label>

          <div className="flex justify-end gap-2 sm:col-span-2">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save room'}
            </button>
          </div>

        </form>
      </Modal>

      {/* IMAGE UPLOAD MODAL */}

      <Modal
        open={Boolean(uploadRoom)}
        onClose={() => setUploadRoom(null)}
        title={`Upload image · Room ${uploadRoom?.roomNumber}`}
      >
        <form
          onSubmit={handleUpload}
          className="space-y-5"
        >

          <p className="text-sm leading-6 text-charcoal/60">
            Upload a room image. The image will be sent to
            the backend and stored in Cloudinary.
          </p>

          {/* IMAGE PREVIEW */}

          {uploadPreview && (
            <div className="overflow-hidden rounded-xl border border-cream-100 bg-cream-50">
              <img
                src={uploadPreview}
                alt="Selected room"
                className="max-h-56 w-full object-cover"
              />
            </div>
          )}

          {/* FILE INPUT */}

          <div className="rounded-xl border-2 border-dashed border-cream-100 bg-cream-50 p-5">

            <input
              id="room-image-upload"
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />

            <label
              htmlFor="room-image-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-lg px-4 py-6 text-center transition hover:bg-white"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/10">
                <ImagePlus className="h-6 w-6 text-gold-500" />
              </div>

              <span className="text-sm font-semibold text-navy-900">
                {uploadFile
                  ? uploadFile.name
                  : 'Choose an image'}
              </span>

              <span className="mt-1 text-xs text-charcoal/50">
                JPG, PNG, WEBP
              </span>
            </label>

          </div>

          {/* SUCCESS MESSAGE */}

          {uploadSuccess && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {uploadSuccess}
            </p>
          )}

          {/* UPLOAD BUTTON */}

          <div className="flex justify-end">

            <button
              type="submit"
              disabled={
                uploadLoading || !uploadFile
              }
              className="inline-flex items-center gap-2 rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />

              {uploadLoading
                ? 'Uploading…'
                : 'Upload image'}
            </button>

          </div>

        </form>
      </Modal>

      {/* DELETE CONFIRMATION */}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete room?"
        message={`Permanently remove room ${deleteTarget?.roomNumber}? This cannot be undone if the backend allows deletion.`}
        confirmLabel="Delete"
        destructive
        loading={saving}
      />

    </div>
  );
}