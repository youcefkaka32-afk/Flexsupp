import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'
import { useStoreData } from '../hooks/useStoreData'

// PIN is stored here — change it to whatever the client wants
const ADMIN_PIN = '1234'
const SESSION_KEY = 'flexsupps_admin_session'

export default function AdminPage() {
  const navigate = useNavigate()
  const { data, loading } = useStoreData()
  const [authenticated, setAuthenticated] = useState(false)
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('products')
  const [storeData, setStoreData] = useState(null)
  const [saveStatus, setSaveStatus] = useState('')

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY)
    if (session === 'authenticated') {
      setAuthenticated(true)
    }
  }, [])

  // Load data once authenticated
  useEffect(() => {
    if (authenticated && data) {
      setStoreData(JSON.parse(JSON.stringify(data))) // deep clone
    }
  }, [authenticated, data])

  function handlePinSubmit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, 'authenticated')
      setError('')
    } else {
      setError('Code PIN incorrect')
      setPin('')
    }
  }

  function handleLogout() {
    setAuthenticated(false)
    sessionStorage.removeItem(SESSION_KEY)
    setPin('')
  }

  function handleDownloadJSON() {
    const json = JSON.stringify(storeData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `flexsupps-data-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    setSaveStatus('✓ Téléchargé')
    setTimeout(() => setSaveStatus(''), 2000)
  }

  function handleUploadJSON(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result)
        setStoreData(parsed)
        setSaveStatus('✓ Fichier importé')
        setTimeout(() => setSaveStatus(''), 2000)
      } catch {
        setSaveStatus('✗ Fichier invalide')
        setTimeout(() => setSaveStatus(''), 2000)
      }
    }
    reader.readAsText(file)
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Chargement...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login__card">
            <h1 className="admin-login__title">Administration</h1>
            <p className="admin-login__subtitle">Entrez votre code PIN</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                className="admin-login__input"
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                maxLength={6}
              />
              {error && <p className="admin-login__error">{error}</p>}
              <button type="submit" className="admin-login__btn">
                Connexion
              </button>
            </form>
            <button
              className="admin-login__back"
              onClick={() => navigate('/')}
            >
              ← Retour au site
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!storeData) {
    return (
      <div className="admin-page">
        <div className="admin-loading">Initialisation...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="admin-header__left">
          <h1 className="admin-header__title">Panneau d'administration</h1>
          <p className="admin-header__subtitle">Flex Supps</p>
        </div>
        <div className="admin-header__right">
          {saveStatus && <span className="admin-header__status">{saveStatus}</span>}
          <button className="admin-btn" onClick={handleDownloadJSON}>
            💾 Télécharger JSON
          </button>
          <label className="admin-btn">
            📤 Importer JSON
            <input
              type="file"
              accept=".json"
              onChange={handleUploadJSON}
              style={{ display: 'none' }}
            />
          </label>
          <button className="admin-btn secondary" onClick={handleLogout}>
            Déconnexion
          </button>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={`admin-tab${activeTab === 'products' ? ' active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Produits ({storeData.products?.length || 0})
        </button>
        <button
          className={`admin-tab${activeTab === 'categories' ? ' active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Catégories ({storeData.categories?.length || 0})
        </button>
        <button
          className={`admin-tab${activeTab === 'brands' ? ' active' : ''}`}
          onClick={() => setActiveTab('brands')}
        >
          Marques ({storeData.brands?.length || 0})
        </button>
        <button
          className={`admin-tab${activeTab === 'promos' ? ' active' : ''}`}
          onClick={() => setActiveTab('promos')}
        >
          Codes promo ({storeData.promoCodes?.length || 0})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <ProductsTab storeData={storeData} setStoreData={setStoreData} />
        )}
        {activeTab === 'categories' && (
          <CategoriesTab storeData={storeData} setStoreData={setStoreData} />
        )}
        {activeTab === 'brands' && (
          <BrandsTab storeData={storeData} setStoreData={setStoreData} />
        )}
        {activeTab === 'promos' && (
          <PromosTab storeData={storeData} setStoreData={setStoreData} />
        )}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Products Tab
// ────────────────────────────────────────────────────────────
function ProductsTab({ storeData, setStoreData }) {
  const [editing, setEditing] = useState(null)
  const [adding, setAdding] = useState(false)

  function handleAdd() {
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: 'Nouveau produit',
      brand: storeData.brands[0]?.name || 'Marque',
      category: storeData.categories[0]?.id || 'whey',
      price: 5000,
      oldPrice: null,
      currency: 'DA',
      image: '/placeholder.jpg',
      imageHover: null,
      href: '#',
      badge: null,
      description: '',
      tags: [],
      flavors: [],
      sizes: [],
      inStock: true,
      featured: false,
    }
    setStoreData({
      ...storeData,
      products: [...storeData.products, newProduct],
    })
    setEditing(newProduct.id)
    setAdding(false)
  }

  function handleDelete(id) {
    if (!confirm('Supprimer ce produit ?')) return
    setStoreData({
      ...storeData,
      products: storeData.products.filter((p) => p.id !== id),
    })
  }

  function handleUpdate(id, field, value) {
    setStoreData({
      ...storeData,
      products: storeData.products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    })
  }

  function handleToggle(id, field) {
    setStoreData({
      ...storeData,
      products: storeData.products.map((p) =>
        p.id === id ? { ...p, [field]: !p[field] } : p
      ),
    })
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2>Gestion des produits</h2>
        <button className="admin-btn primary" onClick={() => setAdding(true)}>
          + Ajouter un produit
        </button>
      </div>

      {adding && (
        <div className="admin-modal-overlay" onClick={() => setAdding(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Ajouter un produit</h3>
            <p>Un nouveau produit sera créé avec des valeurs par défaut.</p>
            <div className="admin-modal__actions">
              <button className="admin-btn primary" onClick={handleAdd}>
                Créer
              </button>
              <button className="admin-btn" onClick={() => setAdding(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Marque</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Stock</th>
              <th>Vedette</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.products.map((product) => (
              <tr key={product.id}>
                <td>
                  {editing === product.id ? (
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    product.name
                  )}
                </td>
                <td>
                  {editing === product.id ? (
                    <select
                      value={product.brand}
                      onChange={(e) => handleUpdate(product.id, 'brand', e.target.value)}
                      className="admin-input"
                    >
                      {storeData.brands.map((b) => (
                        <option key={b.name} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    product.brand
                  )}
                </td>
                <td>
                  {editing === product.id ? (
                    <select
                      value={product.category}
                      onChange={(e) => handleUpdate(product.id, 'category', e.target.value)}
                      className="admin-input"
                    >
                      {storeData.categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    storeData.categories.find((c) => c.id === product.category)?.name || product.category
                  )}
                </td>
                <td>
                  {editing === product.id ? (
                    <input
                      type="number"
                      value={product.price}
                      onChange={(e) => handleUpdate(product.id, 'price', parseFloat(e.target.value) || 0)}
                      className="admin-input"
                      step="100"
                    />
                  ) : (
                    `${product.price.toLocaleString('fr-DZ')} ${product.currency}`
                  )}
                </td>
                <td>
                  <button
                    className={`admin-toggle${product.inStock ? ' active' : ''}`}
                    onClick={() => handleToggle(product.id, 'inStock')}
                  >
                    {product.inStock ? 'En stock' : 'Épuisé'}
                  </button>
                </td>
                <td>
                  <button
                    className={`admin-toggle${product.featured ? ' active' : ''}`}
                    onClick={() => handleToggle(product.id, 'featured')}
                  >
                    {product.featured ? 'Oui' : 'Non'}
                  </button>
                </td>
                <td className="admin-table__actions">
                  {editing === product.id ? (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(null)}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(product.id)}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="admin-btn small danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Categories Tab
// ────────────────────────────────────────────────────────────
function CategoriesTab({ storeData, setStoreData }) {
  const [editing, setEditing] = useState(null)

  function handleAdd() {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: 'Nouvelle catégorie',
    }
    setStoreData({
      ...storeData,
      categories: [...storeData.categories, newCat],
    })
    setEditing(newCat.id)
  }

  function handleDelete(id) {
    if (!confirm('Supprimer cette catégorie ?')) return
    setStoreData({
      ...storeData,
      categories: storeData.categories.filter((c) => c.id !== id),
    })
  }

  function handleUpdate(id, field, value) {
    setStoreData({
      ...storeData,
      categories: storeData.categories.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    })
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2>Gestion des catégories</h2>
        <button className="admin-btn primary" onClick={handleAdd}>
          + Ajouter une catégorie
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.categories.map((cat) => (
              <tr key={cat.id}>
                <td>
                  {editing === cat.id ? (
                    <input
                      type="text"
                      value={cat.id}
                      onChange={(e) => handleUpdate(cat.id, 'id', e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    cat.id
                  )}
                </td>
                <td>
                  {editing === cat.id ? (
                    <input
                      type="text"
                      value={cat.name}
                      onChange={(e) => handleUpdate(cat.id, 'name', e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="admin-table__actions">
                  {editing === cat.id ? (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(null)}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(cat.id)}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="admin-btn small danger"
                    onClick={() => handleDelete(cat.id)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Brands Tab
// ────────────────────────────────────────────────────────────
function BrandsTab({ storeData, setStoreData }) {
  const [editing, setEditing] = useState(null)

  function handleAdd() {
    const newBrand = {
      name: 'Nouvelle marque',
      logo: '/placeholder-logo.svg',
    }
    setStoreData({
      ...storeData,
      brands: [...storeData.brands, newBrand],
    })
    setEditing(newBrand.name)
  }

  function handleDelete(name) {
    if (!confirm('Supprimer cette marque ?')) return
    setStoreData({
      ...storeData,
      brands: storeData.brands.filter((b) => b.name !== name),
    })
  }

  function handleUpdate(oldName, field, value) {
    setStoreData({
      ...storeData,
      brands: storeData.brands.map((b) =>
        b.name === oldName ? { ...b, [field]: value } : b
      ),
    })
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2>Gestion des marques</h2>
        <button className="admin-btn primary" onClick={handleAdd}>
          + Ajouter une marque
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Logo (URL)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.brands.map((brand) => (
              <tr key={brand.name}>
                <td>
                  {editing === brand.name ? (
                    <input
                      type="text"
                      value={brand.name}
                      onChange={(e) => handleUpdate(brand.name, 'name', e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    brand.name
                  )}
                </td>
                <td>
                  {editing === brand.name ? (
                    <input
                      type="text"
                      value={brand.logo}
                      onChange={(e) => handleUpdate(brand.name, 'logo', e.target.value)}
                      className="admin-input"
                    />
                  ) : (
                    <span className="admin-table__logo-url">{brand.logo}</span>
                  )}
                </td>
                <td className="admin-table__actions">
                  {editing === brand.name ? (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(null)}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(brand.name)}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="admin-btn small danger"
                    onClick={() => handleDelete(brand.name)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Promos Tab
// ────────────────────────────────────────────────────────────
function PromosTab({ storeData, setStoreData }) {
  const [editing, setEditing] = useState(null)

  // Initialize promoCodes if not exists
  if (!storeData.promoCodes) {
    storeData.promoCodes = []
  }

  function handleAdd() {
    const newPromo = {
      code: `PROMO${Date.now()}`,
      discount: 10,
      type: 'percentage', // 'percentage' or 'fixed'
      active: true,
      expiresAt: null,
    }
    setStoreData({
      ...storeData,
      promoCodes: [...storeData.promoCodes, newPromo],
    })
    setEditing(newPromo.code)
  }

  function handleDelete(code) {
    if (!confirm('Supprimer ce code promo ?')) return
    setStoreData({
      ...storeData,
      promoCodes: storeData.promoCodes.filter((p) => p.code !== code),
    })
  }

  function handleUpdate(oldCode, field, value) {
    setStoreData({
      ...storeData,
      promoCodes: storeData.promoCodes.map((p) =>
        p.code === oldCode ? { ...p, [field]: value } : p
      ),
    })
  }

  function handleToggle(code) {
    setStoreData({
      ...storeData,
      promoCodes: storeData.promoCodes.map((p) =>
        p.code === code ? { ...p, active: !p.active } : p
      ),
    })
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <h2>Gestion des codes promo</h2>
        <button className="admin-btn primary" onClick={handleAdd}>
          + Ajouter un code promo
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Réduction</th>
              <th>Type</th>
              <th>Actif</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.promoCodes.map((promo) => (
              <tr key={promo.code}>
                <td>
                  {editing === promo.code ? (
                    <input
                      type="text"
                      value={promo.code}
                      onChange={(e) => handleUpdate(promo.code, 'code', e.target.value.toUpperCase())}
                      className="admin-input"
                    />
                  ) : (
                    <strong>{promo.code}</strong>
                  )}
                </td>
                <td>
                  {editing === promo.code ? (
                    <input
                      type="number"
                      value={promo.discount}
                      onChange={(e) => handleUpdate(promo.code, 'discount', parseFloat(e.target.value) || 0)}
                      className="admin-input"
                      step="1"
                    />
                  ) : (
                    promo.discount
                  )}
                </td>
                <td>
                  {editing === promo.code ? (
                    <select
                      value={promo.type}
                      onChange={(e) => handleUpdate(promo.code, 'type', e.target.value)}
                      className="admin-input"
                    >
                      <option value="percentage">Pourcentage (%)</option>
                      <option value="fixed">Montant fixe (DA)</option>
                    </select>
                  ) : (
                    promo.type === 'percentage' ? 'Pourcentage' : 'Montant fixe'
                  )}
                </td>
                <td>
                  <button
                    className={`admin-toggle${promo.active ? ' active' : ''}`}
                    onClick={() => handleToggle(promo.code)}
                  >
                    {promo.active ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="admin-table__actions">
                  {editing === promo.code ? (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(null)}
                    >
                      ✓
                    </button>
                  ) : (
                    <button
                      className="admin-btn small"
                      onClick={() => setEditing(promo.code)}
                    >
                      ✎
                    </button>
                  )}
                  <button
                    className="admin-btn small danger"
                    onClick={() => handleDelete(promo.code)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
