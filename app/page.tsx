'use client';
import { useState, useEffect } from 'react';

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [idEdicion, setIdEdicion] = useState(null);

  const [nombre, setNombre] = useState('');
  const [marca, setMarca] = useState('');
  const [genero, setGenero] = useState('Hombre'); 
  const [categoria, setCategoria] = useState('Calzado');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [talla, setTalla] = useState('');
  const [imagenesGuardar, setImagenesGuardar] = useState([]);
  const [anuncios, setAnuncios] = useState<any[]>([]);
  const [tituloAnuncio, setTituloAnuncio] = useState('');
  const [archivoAnuncio, setArchivoAnuncio] = useState<File | null>(null);
  const cargarDatos = async () => {
  try {
    const resP = await fetch('https://sportlife-api-m3yg.onrender.com/productos');
    setProductos(await resP.json());

    const resO = await fetch('https://sportlife-api-m3yg.onrender.com/ordenes');
    setOrdenes(await resO.json());

    // 👇 AGREGA ESTA LÍNEA AQUÍ ADENTRO:
    const resA = await fetch('https://sportlife-api-m3yg.onrender.com/anuncios');
    setAnuncios(await resA.json());

  } catch (e) { console.error(e); }
};

  useEffect(() => { cargarDatos(); }, []);

  const categoriasExistentes = Array.from(new Set(productos.map(p => p.categoria).filter(Boolean)));
  const opcionesCategoria = Array.from(new Set(['Calzado', 'Ropa', 'Camisolas', 'Accesorios', ...categoriasExistentes]));

  const cargarParaEdicion = (producto) => {
    setNombre(producto.nombre);
    setMarca(producto.marca);
    setGenero(producto.genero || 'Hombre');
    setCategoria(producto.categoria || 'Calzado');
    setNuevaCategoria('');
    setPrecio(producto.precio);
    setTalla(producto.talla);
    setDescripcion(producto.descripcion || '');
    setIdEdicion(producto.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelarEdicion = () => {
    setIdEdicion(null);
    setNombre(''); setMarca(''); setNuevaCategoria(''); setDescripcion(''); setPrecio(''); setTalla(''); setImagenesGuardar([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    const marcaLimpia = marca.trim().toUpperCase();
    formData.append('marca', marcaLimpia);
    formData.append('genero', genero);
    
    const categoriaFinal = nuevaCategoria.trim() !== '' ? nuevaCategoria.trim() : categoria;
    formData.append('categoria', categoriaFinal);
    
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('talla', talla);
    imagenesGuardar.forEach(img => formData.append('imagenes', img));

    const url = idEdicion ? `https://sportlife-api-m3yg.onrender.com/productos/${idEdicion}` : 'https://sportlife-api-m3yg.onrender.com/productos';
    const method = idEdicion ? 'PUT' : 'POST';

    const res = await fetch(url, { method, body: formData });
    if (res.ok) {
      alert(idEdicion ? 'Producto actualizado' : 'Producto guardado');
      cancelarEdicion();
      cargarDatos();
    } else {
      alert('Error al guardar el producto.');
    }
  };

  const eliminarProducto = async (id) => {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    await fetch(`https://sportlife-api-m3yg.onrender.com/productos/${id}`, { method: 'DELETE' });
    cargarDatos();
  };

  const borrarPedido = async (id) => {
    if (!confirm('¿Marcar como entregado y eliminar?')) return;
    await fetch(`https://sportlife-api-m3yg.onrender.com/ordenes/${id}`, { method: 'DELETE' });
    cargarDatos();
  };

  const crearAnuncio = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Usamos FormData para poder mandar la imagen física
  const formData = new FormData();
  formData.append('titulo', tituloAnuncio);
  if (archivoAnuncio) {
    formData.append('imagen', archivoAnuncio); // 'imagen' es el nombre del archivo
  }

  try {
    await fetch('https://sportlife-api-m3yg.onrender.com/anuncios', {
      method: 'POST',
      body: formData // Ya no lleva headers, el navegador los pone solos
    });
    // ... código ...
setTituloAnuncio('');
setArchivoAnuncio(null);
cargarDatos(); // <--- Aquí estaba el cargarAnuncios()
alert("¡Anuncio publicado con foto!");
} catch (error) {
    console.error(error);
  }
};
const borrarAnuncio = async (id: string) => {
  if(!confirm("¿Seguro que quieres borrar este anuncio?")) return;
  try {
    await fetch(`https://sportlife-api-m3yg.onrender.com/anuncios/${id}`, { method: 'DELETE' });
    cargarDatos(); // Recarga la lista
  } catch (error) {
    console.error(error);
  }
};

}, []);
  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow">
          <h1 className="text-3xl font-bold">Administración</h1>
          <a href="/catalogo" target="_blank" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow transition">Ver Tienda Pública ↗</a>
        </div>

        {/* 📢 SECCIÓN DE ANUNCIOS */}
<div className="mt-12 bg-zinc-900 p-6 md:p-10 rounded-2xl border border-zinc-800 shadow-2xl">
  <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-widest border-b border-zinc-800 pb-4">
    📢 Administrador de Banners
  </h2>
  
  {/* Formulario para crear */}
  <form onSubmit={crearAnuncio} className="flex flex-col gap-4 mb-10">
    <input 
      type="text" 
      placeholder="Título del anuncio (Ej: 🔥 Gran Remate 30% OFF)" 
      value={tituloAnuncio}
      onChange={(e) => setTituloAnuncio(e.target.value)}
      className="p-4 bg-black text-white border border-zinc-700 rounded-xl focus:border-yellow-500 focus:outline-none transition-colors"
      required
    />
    <input 
  type="file" 
  accept="image/*"
  onChange={(e) => setArchivoAnuncio(e.target.files?.[0] || null)}
  className="p-4 bg-black text-white border border-zinc-700 rounded-xl focus:border-yellow-500 transition-colors"
/>
    <button type="submit" className="bg-white text-black font-bold p-4 rounded-xl hover:bg-yellow-500 transition-colors uppercase tracking-widest mt-2">
      + Publicar Anuncio
    </button>
  </form>

  {/* Lista de anuncios para poder borrarlos */}
  <h3 className="text-lg font-bold text-zinc-400 mb-4 uppercase">Anuncios Activos:</h3>
  <div className="flex flex-col gap-4">
    {anuncios.length === 0 ? (
      <p className="text-zinc-600 italic">No hay anuncios activos en este momento.</p>
    ) : (
      anuncios.map(anuncio => (
        <div key={anuncio.id} className="flex justify-between items-center bg-black p-4 rounded-xl border border-zinc-800">
          <div>
            <p className="text-white font-bold text-lg">{anuncio.titulo}</p>
            {anuncio.imagenUrl && <p className="text-blue-400 text-xs truncate max-w-xs mt-1">Con imagen adjunta</p>}
          </div>
          <button 
            onClick={() => borrarAnuncio(anuncio.id)}
            className="bg-red-900/50 text-red-500 hover:text-white hover:bg-red-600 px-6 py-2 rounded-lg font-bold transition-colors"
          >
            Eliminar
          </button>
        </div>
      ))
    )}
  </div>
</div>
        
        {/* Sección Pedidos */}
        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-blue-600">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📦 Pedidos Recibidos ({ordenes.length})</h2>
          <div className="space-y-4">
            {ordenes.map(o => {
              // Convertimos el texto JSON de los productos de vuelta a un arreglo
              let carritoPedido = [];
              try {
                carritoPedido = JSON.parse(o.productos);
              } catch (e) {
                console.error("Error leyendo productos del pedido", e);
              }

              return (
                <div key={o.id} className="border p-5 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-50 gap-4 shadow-sm">
                  <div className="w-full">
                    {/* Encabezado del Pedido */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-black tracking-widest shadow-sm">
                        PEDIDO #{o.id}
                      </span>
                      <p className="font-black text-xl text-gray-800">{o.cliente}</p>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 font-medium">📱 Tel: {o.telefono} &nbsp;|&nbsp; 📍 Dir: {o.direccion}</p>
                    
                    {/* Detalles de los productos comprados */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm mb-3">
                      <p className="font-bold text-gray-700 mb-2 uppercase tracking-widest text-xs">Artículos Solicitados:</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600">
                        {carritoPedido.map((item, index) => (
                          <li key={index}>
                            <span className="font-bold text-gray-900">{item.nombre}</span> 
                            <span className="text-blue-600 font-bold"> (Talla: {item.talla})</span> 
                            <span className="text-gray-500"> - Q{item.precio}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-emerald-600 font-black text-xl">Total: Q{o.total}</p>
                  </div>
                  
                  <button onClick={() => borrarPedido(o.id)} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-colors whitespace-nowrap">
                    ✔ Marcar Entregado
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Formulario Producto */}
        <div className="bg-white p-6 rounded-2xl shadow border-t-4 border-emerald-600">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">{idEdicion ? '✏️ Editando Producto...' : '➕ Agregar Nuevo Producto'}</h2>
            {idEdicion && <button onClick={cancelarEdicion} type="button" className="text-sm text-red-600 hover:underline font-bold">Cancelar Edición</button>}
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="border p-3 rounded-lg bg-gray-50" required />
            <input placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} className="border p-3 rounded-lg bg-gray-50" required />
            
            <select value={genero} onChange={e => setGenero(e.target.value)} className="border p-3 rounded-lg bg-gray-50 font-bold text-blue-900">
              <option value="Hombre">Hombre</option>
              <option value="Mujer">Mujer</option>
              <option value="Niños">Niños</option>
              <option value="Unisex">Unisex</option>
            </select>

            <div className="flex gap-2">
              <select value={categoria} onChange={e => { setCategoria(e.target.value); setNuevaCategoria(''); }} className="border p-3 rounded-lg bg-gray-50 w-1/2 font-bold text-emerald-900" disabled={nuevaCategoria !== ''}>
                {opcionesCategoria.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <input placeholder="O nueva (ej: Gorras)" value={nuevaCategoria} onChange={e => setNuevaCategoria(e.target.value)} className="border p-3 rounded-lg bg-gray-50 w-1/2" />
            </div>

            <input placeholder="Precio (Q)" type="number" value={precio} onChange={e => setPrecio(e.target.value)} className="border p-3 rounded-lg bg-gray-50" required />
            <input placeholder="Tallas (Ej: S, M, L)" value={talla} onChange={e => setTalla(e.target.value)} className="border p-3 rounded-lg bg-gray-50" required />
            <input type="file" multiple onChange={e => setImagenesGuardar(Array.from(e.target.files))} className="border p-2 rounded-lg md:col-span-2 bg-gray-50" />
            <textarea placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} className="border p-3 rounded-lg md:col-span-2 h-24 bg-gray-50" />
            
            <button className={`md:col-span-2 text-white py-3 rounded-xl font-bold shadow transition ${idEdicion ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {idEdicion ? 'Actualizar Producto' : 'Guardar Producto'}
            </button>
          </form>
        </div>

        {/* Inventario */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4 text-gray-800">📋 Inventario Actual</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {productos.map(p => (
              <div key={p.id} className="border p-4 rounded-xl bg-gray-50 flex flex-col justify-between">
                <div>
                  <img src={p.imagenUrl?.includes('http') ? p.imagenUrl.replace('http://localhost:3000', 'https://sportlife-api-m3yg.onrender.com') : `https://sportlife-api-m3yg.onrender.com${p.imagenUrl}`} className="w-full h-32 object-cover rounded mb-2 border border-gray-200" />
                  <h3 className="font-bold text-gray-900 truncate">{p.nombre}</h3>
                  <p className="text-sm text-gray-500">{p.marca} | Q{p.precio}</p>
                  <p className="text-xs text-gray-400 font-bold mt-1">
                    <span className="text-blue-600">{p.genero || 'N/A'}</span> - <span className="text-emerald-600">{p.categoria}</span>
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => cargarParaEdicion(p)} className="w-1/2 bg-blue-100 text-blue-700 py-2 rounded-lg font-bold text-xs hover:bg-blue-200">Editar</button>
                  <button onClick={() => eliminarProducto(p.id)} className="w-1/2 bg-red-100 text-red-700 py-2 rounded-lg font-bold text-xs hover:bg-red-200">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
