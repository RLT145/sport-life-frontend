/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useEffect, Key, SetStateAction, Key } from 'react';

export default function Catalogo() {
  const [montado, setMontado] = useState(false); // Estado para evitar problemas de hidratación
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('defecto');
  const [generoFiltro, setGeneroFiltro] = useState('TODOS');
  const [categoriaFiltro, setCategoriaFiltro] = useState('TODAS');
  
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [tallaSeleccionada, setTallaSeleccionada] = useState('');
  const [imagenActiva, setImagenActiva] = useState(null);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const miNumeroWhatsApp = "50254869449";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMontado(true); // Se activa solo en el navegador
    fetch('https://sportlife-api-m3yg.onrender.com/productos').then(res => res.json()).then(data => setProductos(data));
    const g = localStorage.getItem('carrito');
    if (g) setCarrito(JSON.parse(g));
  }, []);

  useEffect(() => { 
    if (montado) localStorage.setItem('carrito', JSON.stringify(carrito)); 
  }, [carrito, montado]);

  // Si no se ha montado en el cliente, no renderizamos nada para evitar conflictos con extensiones
  if (!montado) return null;

  const agregarAlCarrito = (p: never, tallaElegida: string) => {
    setCarrito([...carrito, { ...p, talla: tallaElegida }]);
    setProductoSeleccionado(null); setTallaSeleccionada('');
    alert(`✅ "${p.nombre}" añadido al carrito.`);
  };

  const eliminarDelCarrito = (index: number) => setCarrito(carrito.filter((_, i) => i !== index));

  const finalizarPedido = async () => {
    if (!nombre || !telefono || !direccion) return alert('Completa los datos de envío.');
    const res = await fetch('https://sportlife-api-m3yg.onrender.com/ordenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente: nombre, telefono, direccion, carrito, total: carrito.reduce((sum, p) => sum + p.precio, 0) })
    });
    const data = await res.json();
    if (data.success) {
      let codigoPedido = data.codigo || data.trackingCode || data.ordenId || "SL-0000";
let msg = `*SPORT LIFE - NUEVO PEDIDO #${codigoPedido}* 🛍️%0A%0A👤 *CLIENTE:* ${nombre}%0A📱 *TEL:* ${telefono}%0A📍 *DIRECCIÓN:* ${direccion}%0A%0A🛒 *PRODUCTOS:*%0A`;
      carrito.forEach((i, idx) => msg += `${idx + 1}. ${i.nombre} - ${i.talla} - Q${i.precio}%0A`);
      msg += `%0A💰 *TOTAL: Q${carrito.reduce((sum, p) => sum + p.precio, 0).toFixed(2)}*`;
      window.open(`https://wa.me/${miNumeroWhatsApp}?text=${msg}`, '_blank');
      setCarrito([]); localStorage.removeItem('carrito'); setMostrarCarrito(false);
    }
  };

  let prodProcesados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
  
  if (generoFiltro !== 'TODOS') {
    prodProcesados = prodProcesados.filter(p => p.genero === generoFiltro);
  }
  
  const categoriasDisponibles = ['TODAS', ...Array.from(new Set(prodProcesados.map(p => p.categoria).filter(Boolean)))];

  if (categoriaFiltro !== 'TODAS') {
    prodProcesados = prodProcesados.filter(p => p.categoria === categoriaFiltro);
  }

  if (orden === 'menor') prodProcesados.sort((a, b) => a.precio - b.precio);
  if (orden === 'mayor') prodProcesados.sort((a, b) => b.precio - a.precio);
  
  const marcasAgrupadas = Array.from(new Set(prodProcesados.map(p => p.marca)));

  return (
    <main className="relative min-h-screen text-white selection:bg-red-600 font-sans bg-black">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/fondo.gif" alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black"></div>
      </div>

      <div className="relative z-10">
        
        <header className="sticky top-0 z-40 bg-black/70 backdrop-blur-xl border-b border-zinc-800 px-6 py-4 flex justify-between items-center shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" className="h-8 md:h-10 object-contain" alt="SL" onError={(e) => e.currentTarget.style.display = 'none'} />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] hidden sm:block">SPORT<span className="text-red-600">LIFE</span></h2>
          </div>
          <button onClick={() => setMostrarCarrito(true)} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-5 md:px-8 py-2 md:py-2.5 text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:border-red-600 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]">
            CART ({carrito.length})
          </button>
        </header>

        <section className="pt-20 pb-16 px-6 flex flex-col items-center justify-center text-center">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[0.1em] drop-shadow-2xl">
            SPORT<span className="text-red-600">LIFE</span>
          </h1>
          <p className="mt-6 text-zinc-400 tracking-[0.4em] text-xs md:text-sm uppercase font-bold">Rinde al máximo, viste con estilo</p>
        </section>

        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-4">
          <input placeholder="BUSCAR ARTÍCULO..." className="bg-black/50 backdrop-blur-md border border-zinc-800 w-full p-4 text-sm uppercase tracking-widest focus:outline-none focus:border-red-600" onChange={(e) => setBusqueda(e.target.value)} />
          
          <select className="bg-black/50 backdrop-blur-md border border-zinc-800 p-4 uppercase text-xs tracking-widest focus:outline-none focus:border-red-600 md:w-64" onChange={(e) => { setGeneroFiltro(e.target.value); setCategoriaFiltro('TODAS'); }}>
            <option value="TODOS">TODOS (Hombre/Mujer/Niños)</option>
            <option value="Hombre">HOMBRE</option>
            <option value="Mujer">MUJER</option>
            <option value="Niños">NIÑOS</option>
            <option value="Unisex">UNISEX</option>
          </select>

          <select className="bg-black/50 backdrop-blur-md border border-zinc-800 p-4 uppercase text-xs tracking-widest focus:outline-none focus:border-red-600 md:w-64" onChange={(e) => setOrden(e.target.value)}>
            <option value="defecto">ORDENAR PRECIO...</option>
            <option value="menor">MENOR A MAYOR</option>
            <option value="mayor">MAYOR A MENOR</option>
          </select>
        </div>

        <div className="max-w-6xl mx-auto px-6 mt-8 flex gap-3 overflow-x-auto pb-4 scrollbar-hide justify-start md:justify-center">
          {categoriasDisponibles.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaFiltro(cat)}
              className={`px-8 py-3 border font-bold uppercase text-xs tracking-[0.2em] transition-all whitespace-nowrap ${
                categoriaFiltro === cat 
                  ? 'bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' 
                  : 'bg-black/50 backdrop-blur-md border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-16">
          {marcasAgrupadas.length === 0 ? (
             <p className="text-zinc-500 uppercase tracking-widest text-center py-20 text-sm">No se encontraron productos.</p>
          ) : (
            marcasAgrupadas.map(marca => (
              <div key={marca} className="mb-24">
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-[0.15em] mb-12 flex items-center gap-4">
                  <span className="w-8 h-1 bg-red-600 block"></span>
                  {marca}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {prodProcesados.filter(p => p.marca === marca).map(p => (
                    <div key={p.id} onClick={() => { setProductoSeleccionado(p); setImagenActiva(p.imagenes?.[0] || p.imagenUrl); }} className="group bg-black/60 backdrop-blur-sm border border-zinc-800/80 p-5 cursor-pointer hover:border-red-600/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute top-4 right-4 z-10 bg-red-600 text-white text-[9px] font-black uppercase px-2 py-1 tracking-widest">{p.genero}</div>
                      <div className="aspect-square bg-zinc-950 mb-5 overflow-hidden flex items-center justify-center">
           <img 
              src={p.imagenUrl?.includes('localhost') ? p.imagenUrl.replace('http://localhost:3000', 'https://sportlife-api-m3yg.onrender.com') : p.imagenUrl?.startsWith('http') ? p.imagenUrl : `https://sportlife-api-m3yg.onrender.com${p.imagenUrl}`}
              className="w-full h-full object-cover"
              alt={p.nombre}
            />
          </div>
                      <span className="text-zinc-500 text-[10px] uppercase tracking-widest block mb-1">{p.categoria}</span>
                      <h5 className="font-bold uppercase tracking-widest text-sm line-clamp-1">{p.nombre}</h5>
                      <div className="flex justify-between items-end mt-4">
                        <p className="text-red-600 font-black text-xl">Q{p.precio}</p>
                        <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em] group-hover:text-white transition-colors">VER +</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL DEL PRODUCTO */}
{productoSeleccionado && (
  <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-4 overflow-y-auto">
    <div className="bg-zinc-950/90 border border-zinc-800 w-full max-w-5xl relative p-6 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
      <button onClick={() => setProductoSeleccionado(null)} className="absolute top-6 right-6 text-zinc-500 hover:text-white text-3xl transition-colors z-10">✕</button>
      
      <div className="flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-black border border-zinc-900 p-2">
            <img 
              src={imagenActiva.includes('localhost') ? imagenActiva.replace('http://localhost:3000', 'https://sportlife-api-m3yg.onrender.com') : imagenActiva.startsWith('http') ? imagenActiva : `https://sportlife-api-m3yg.onrender.com${imagenActiva}`}
              className="w-full h-full object-cover"
              alt="Producto seleccionado"
            />
        </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {(Array.isArray(productoSeleccionado.imagenes) 
              ? productoSeleccionado.imagenes 
              : typeof productoSeleccionado.imagenes === 'string' 
                ? JSON.parse(productoSeleccionado.imagenes) 
                : [productoSeleccionado.imagenUrl]
            ).map((img: string, i: number) => (
            <img 
              key={i} 
              src={img.includes('localhost') ? img.replace('http://localhost:3000', 'https://sportlife-api-m3yg.onrender.com') : img.startsWith('http') ? img : `https://sportlife-api-m3yg.onrender.com${img}`} 
              onClick={() => setImagenActiva(img)} 
              className="w-16 h-16 object-cover cursor-pointer border border-zinc-700 hover:border-red-600 transition"
              alt="Miniatura"
            />
          ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-xs mb-3 block">{productoSeleccionado.marca} // {productoSeleccionado.genero} // {productoSeleccionado.categoria}</span>
          <h2 className="text-3xl md:text-5xl font-black uppercase mb-4 leading-tight">{productoSeleccionado.nombre}</h2>
          <p className="text-3xl font-black text-white mb-6">Q{productoSeleccionado.precio}</p>
          
          {/* DESCRIPCIÓN DEL PRODUCTO */}
          {productoSeleccionado.descripcion && (
            <div className="mb-6 pb-6 border-b border-zinc-800">
              <p className="text-zinc-400 text-sm leading-relaxed uppercase tracking-wider">
                {productoSeleccionado.descripcion}
              </p>
            </div>
          )}
          
          <div className="mb-8">
            <span className="text-zinc-500 text-xs uppercase tracking-widest mb-4 block">Seleccionar Talla</span>
            <div className="flex flex-wrap gap-3">
              {productoSeleccionado.talla.split(',').map((t: Key | null | undefined) => (
                <button key={t} onClick={() => setTallaSeleccionada(t.trim())} className={`w-14 h-14 border font-bold transition-all duration-300 ${tallaSeleccionada === t.trim() ? 'bg-white text-black border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-transparent border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}>{t.trim()}</button>
              ))}
            </div>
          </div>
          
          <button onClick={() => { if(tallaSeleccionada) agregarAlCarrito(productoSeleccionado, tallaSeleccionada); else alert('Por favor, selecciona una talla primero.'); }} className="w-full bg-red-600 text-white py-5 font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-500">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>
  </div>
)}

        {mostrarCarrito && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end">
            <div className="bg-zinc-950/95 w-full max-w-md h-full p-8 border-l border-zinc-800 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] overflow-y-auto">
              <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
                <h2 className="text-2xl font-black uppercase tracking-widest">Carrito</h2>
                <button onClick={() => setMostrarCarrito(false)} className="text-zinc-500 hover:text-white text-2xl transition-colors">✕</button>
              </div>
              <div className="flex-grow">
                {carrito.length === 0 ? ( <p className="text-zinc-600 uppercase tracking-widest text-center mt-20 text-sm">Tu carrito está vacío</p> ) : (
                  <div className="space-y-6">
                    {carrito.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-black p-4 border border-zinc-900">
                        <div>
                          <p className="font-bold uppercase text-sm">{item.nombre}</p>
                          <p className="text-xs text-zinc-500 tracking-widest mt-1">TALLA: {item.talla} | Q{item.precio}</p>
                        </div>
                        <button onClick={() => eliminarDelCarrito(idx)} className="text-red-900 hover:text-red-500 font-black">✕</button>
                      </div>
                    ))}
                    <div className="pt-8 border-t border-zinc-900 space-y-4 mt-8">
                      <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-4">Información de Envío</h3>
                      <input type="text" placeholder="NOMBRE COMPLETO" value={nombre} onChange={e => setNombre(e.target.value)} className="w-full bg-transparent border-b border-zinc-700 p-2 text-sm uppercase tracking-wider focus:outline-none focus:border-red-600" />
                      <input type="text" placeholder="TELÉFONO" value={telefono} onChange={e => setTelefono(e.target.value)} className="w-full bg-transparent border-b border-zinc-700 p-2 text-sm uppercase tracking-wider focus:outline-none focus:border-red-600" />
                      <textarea placeholder="DIRECCIÓN DE ENTREGA" value={direccion} onChange={e => setDireccion(e.target.value)} className="w-full bg-transparent border-b border-zinc-700 p-2 text-sm uppercase tracking-wider focus:outline-none focus:border-red-600 h-16 resize-none" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 pt-8 border-t border-zinc-900">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-white">Q{carrito.reduce((sum, p) => sum + p.precio, 0).toFixed(2)}</span>
                </div>
                <button onClick={finalizarPedido} disabled={carrito.length === 0} className="w-full bg-white text-black py-4 font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-black">Confirmar Orden</button>
              </div>
            </div>
          </div>
        )}
        <footer className="border-t border-zinc-900 mt-20 py-12 bg-black/80 backdrop-blur-md text-center">
          <div className="flex justify-center gap-8 text-zinc-600 uppercase font-bold text-xs tracking-widest">
            <a href="https://www.facebook.com/share/14tyntTFCbX/" target="_blank" className="hover:text-blue-500 transition-colors">Facebook</a>
            <a href="https://www.instagram.com/sportlife_p" target="_blank" className="hover:text-pink-500 transition-colors">Instagram</a>
            <a href="https://www.tiktok.com/@sportlife_kiche" target="_blank" className="hover:text-white transition-colors">TikTok</a>
          </div>
          <p className="mt-8 text-zinc-800 text-[10px] uppercase tracking-[0.3em]">© {new Date().getFullYear()} SPORT LIFE</p>
        </footer>
      </div>
    </main>
  );
}
