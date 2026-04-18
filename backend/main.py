from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Database path
DB_PATH = os.path.join(os.path.dirname(__file__), 'inventario.db')

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # Tabla de proveedores
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS proveedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            contacto TEXT,
            telefono TEXT,
            email TEXT,
            direccion TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Tabla de equipos
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS equipos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            tipo TEXT NOT NULL,
            marca TEXT,
            modelo TEXT,
            serial TEXT UNIQUE NOT NULL,
            estado TEXT DEFAULT 'activo',
            ubicacion TEXT,
            proveedor_id INTEGER,
            fecha_compra DATE,
            fecha_garantia DATE,
            valor REAL,
            observaciones TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (proveedor_id) REFERENCES proveedores (id)
        )
    ''')
    
    # Tabla de componentes (partes internas)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS componentes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipo_id INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            marca TEXT,
            modelo TEXT,
            serial TEXT,
            capacidad TEXT,
            especificaciones TEXT,
            estado TEXT DEFAULT 'bueno',
            FOREIGN KEY (equipo_id) REFERENCES equipos (id) ON DELETE CASCADE
        )
    ''')
    
    # Tabla de hojas de vida (historial de movimientos)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS hojas_vida (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            equipo_id INTEGER NOT NULL,
            tipo_movimiento TEXT NOT NULL,
            descripcion TEXT,
            responsable TEXT,
            fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            observaciones TEXT,
            FOREIGN KEY (equipo_id) REFERENCES equipos (id) ON DELETE CASCADE
        )
    ''')
    
    conn.commit()
    conn.close()

# Inicializar la base de datos al arrancar
init_db()

# ============ RUTAS DE PROVEEDORES ============

@app.route('/proveedores', methods=['GET'])
def get_proveedores():
    conn = get_db()
    proveedores = conn.execute('SELECT * FROM proveedores ORDER BY nombre').fetchall()
    conn.close()
    return jsonify([dict(p) for p in proveedores])

@app.route('/proveedores', methods=['POST'])
def create_proveedor():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO proveedores (nombre, contacto, telefono, email, direccion)
        VALUES (?, ?, ?, ?, ?)
    ''', (data['nombre'], data.get('contacto'), data.get('telefono'), 
          data.get('email'), data.get('direccion')))
    conn.commit()
    proveedor_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': proveedor_id, 'message': 'Proveedor creado exitosamente'}), 201

@app.route('/proveedores/<int:id>', methods=['PUT'])
def update_proveedor(id):
    data = request.json
    conn = get_db()
    conn.execute('''
        UPDATE proveedores SET nombre=?, contacto=?, telefono=?, email=?, direccion=?
        WHERE id=?
    ''', (data['nombre'], data.get('contacto'), data.get('telefono'), 
          data.get('email'), data.get('direccion'), id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Proveedor actualizado exitosamente'})

@app.route('/proveedores/<int:id>', methods=['DELETE'])
def delete_proveedor(id):
    conn = get_db()
    conn.execute('DELETE FROM proveedores WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Proveedor eliminado exitosamente'})

# ============ RUTAS DE EQUIPOS ============

@app.route('/equipos', methods=['GET'])
def get_equipos():
    conn = get_db()
    equipos = conn.execute('''
        SELECT e.*, p.nombre as proveedor_nombre
        FROM equipos e
        LEFT JOIN proveedores p ON e.proveedor_id = p.id
        ORDER BY e.created_at DESC
    ''').fetchall()
    conn.close()
    return jsonify([dict(e) for e in equipos])

@app.route('/equipos/<int:id>', methods=['GET'])
def get_equipo(id):
    conn = get_db()
    equipo = conn.execute('''
        SELECT e.*, p.nombre as proveedor_nombre
        FROM equipos e
        LEFT JOIN proveedores p ON e.proveedor_id = p.id
        WHERE e.id = ?
    ''', (id,)).fetchone()
    
    if not equipo:
        conn.close()
        return jsonify({'error': 'Equipo no encontrado'}), 404
    
    componentes = conn.execute('SELECT * FROM componentes WHERE equipo_id = ?', (id,)).fetchall()
    hojas_vida = conn.execute('''
        SELECT * FROM hojas_vida WHERE equipo_id = ? ORDER BY fecha DESC
    ''', (id,)).fetchall()
    
    conn.close()
    
    result = dict(equipo)
    result['componentes'] = [dict(c) for c in componentes]
    result['hojas_vida'] = [dict(h) for h in hojas_vida]
    
    return jsonify(result)

@app.route('/equipos', methods=['POST'])
def create_equipo():
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            INSERT INTO equipos (nombre, tipo, marca, modelo, serial, estado, ubicacion, 
                                proveedor_id, fecha_compra, fecha_garantia, valor, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (data['nombre'], data['tipo'], data.get('marca'), data.get('modelo'),
              data['serial'], data.get('estado', 'activo'), data.get('ubicacion'),
              data.get('proveedor_id'), data.get('fecha_compra'), data.get('fecha_garantia'),
              data.get('valor'), data.get('observaciones')))
        
        equipo_id = cursor.lastrowid
        
        # Agregar componentes si existen
        if 'componentes' in data:
            for comp in data['componentes']:
                cursor.execute('''
                    INSERT INTO componentes (equipo_id, tipo, marca, modelo, serial, capacidad, especificaciones, estado)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (equipo_id, comp['tipo'], comp.get('marca'), comp.get('modelo'),
                      comp.get('serial'), comp.get('capacidad'), comp.get('especificaciones'),
                      comp.get('estado', 'bueno')))
        
        # Crear registro en hoja de vida
        cursor.execute('''
            INSERT INTO hojas_vida (equipo_id, tipo_movimiento, descripcion, responsable)
            VALUES (?, ?, ?, ?)
        ''', (equipo_id, 'ingreso', 'Registro inicial del equipo', data.get('responsable', 'Sistema')))
        
        conn.commit()
        conn.close()
        return jsonify({'id': equipo_id, 'message': 'Equipo creado exitosamente'}), 201
    
    except sqlite3.IntegrityError as e:
        conn.close()
        return jsonify({'error': 'El serial ya existe en el sistema'}), 400

@app.route('/equipos/<int:id>', methods=['PUT'])
def update_equipo(id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE equipos SET nombre=?, tipo=?, marca=?, modelo=?, serial=?, estado=?, 
                          ubicacion=?, proveedor_id=?, fecha_compra=?, fecha_garantia=?, 
                          valor=?, observaciones=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
    ''', (data['nombre'], data['tipo'], data.get('marca'), data.get('modelo'),
          data['serial'], data.get('estado'), data.get('ubicacion'),
          data.get('proveedor_id'), data.get('fecha_compra'), data.get('fecha_garantia'),
          data.get('valor'), data.get('observaciones'), id))
    
    conn.commit()
    conn.close()
    return jsonify({'message': 'Equipo actualizado exitosamente'})

@app.route('/equipos/<int:id>', methods=['DELETE'])
def delete_equipo(id):
    conn = get_db()
    conn.execute('DELETE FROM equipos WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Equipo eliminado exitosamente'})

@app.route('/equipos/<int:id>/estado', methods=['PATCH'])
def cambiar_estado_equipo(id):
    data = request.json
    nuevo_estado = data['estado']
    descripcion = data.get('descripcion', f'Cambio de estado a: {nuevo_estado}')
    responsable = data.get('responsable', 'Sistema')
    
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('UPDATE equipos SET estado=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', 
                   (nuevo_estado, id))
    
    # Registrar en hoja de vida
    tipo_movimiento = nuevo_estado
    cursor.execute('''
        INSERT INTO hojas_vida (equipo_id, tipo_movimiento, descripcion, responsable, observaciones)
        VALUES (?, ?, ?, ?, ?)
    ''', (id, tipo_movimiento, descripcion, responsable, data.get('observaciones')))
    
    conn.commit()
    conn.close()
    return jsonify({'message': f'Estado cambiado a {nuevo_estado}'})

# ============ RUTAS DE COMPONENTES ============

@app.route('/equipos/<int:equipo_id>/componentes', methods=['GET'])
def get_componentes(equipo_id):
    conn = get_db()
    componentes = conn.execute('SELECT * FROM componentes WHERE equipo_id = ?', (equipo_id,)).fetchall()
    conn.close()
    return jsonify([dict(c) for c in componentes])

@app.route('/equipos/<int:equipo_id>/componentes', methods=['POST'])
def add_componente(equipo_id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO componentes (equipo_id, tipo, marca, modelo, serial, capacidad, especificaciones, estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (equipo_id, data['tipo'], data.get('marca'), data.get('modelo'),
          data.get('serial'), data.get('capacidad'), data.get('especificaciones'),
          data.get('estado', 'bueno')))
    
    # Registrar en hoja de vida
    cursor.execute('''
        INSERT INTO hojas_vida (equipo_id, tipo_movimiento, descripcion, responsable)
        VALUES (?, ?, ?, ?)
    ''', (equipo_id, 'componente_agregado', f'Se agregó componente: {data["tipo"]}', 
          data.get('responsable', 'Sistema')))
    
    conn.commit()
    componente_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': componente_id, 'message': 'Componente agregado exitosamente'}), 201

@app.route('/componentes/<int:id>', methods=['PUT'])
def update_componente(id):
    data = request.json
    conn = get_db()
    conn.execute('''
        UPDATE componentes SET tipo=?, marca=?, modelo=?, serial=?, capacidad=?, especificaciones=?, estado=?
        WHERE id=?
    ''', (data['tipo'], data.get('marca'), data.get('modelo'), data.get('serial'),
          data.get('capacidad'), data.get('especificaciones'), data.get('estado'), id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Componente actualizado exitosamente'})

@app.route('/componentes/<int:id>', methods=['DELETE'])
def delete_componente(id):
    conn = get_db()
    conn.execute('DELETE FROM componentes WHERE id=?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Componente eliminado exitosamente'})

# ============ RUTAS DE HOJAS DE VIDA ============

@app.route('/equipos/<int:equipo_id>/hojas-vida', methods=['GET'])
def get_hojas_vida(equipo_id):
    conn = get_db()
    hojas = conn.execute('''
        SELECT * FROM hojas_vida WHERE equipo_id = ? ORDER BY fecha DESC
    ''', (equipo_id,)).fetchall()
    conn.close()
    return jsonify([dict(h) for h in hojas])

@app.route('/equipos/<int:equipo_id>/hojas-vida', methods=['POST'])
def add_hoja_vida(equipo_id):
    data = request.json
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO hojas_vida (equipo_id, tipo_movimiento, descripcion, responsable, observaciones)
        VALUES (?, ?, ?, ?, ?)
    ''', (equipo_id, data['tipo_movimiento'], data.get('descripcion'),
          data.get('responsable'), data.get('observaciones')))
    
    conn.commit()
    hoja_id = cursor.lastrowid
    conn.close()
    return jsonify({'id': hoja_id, 'message': 'Registro agregado exitosamente'}), 201

# ============ ESTADÍSTICAS ============

@app.route('/estadisticas', methods=['GET'])
def get_estadisticas():
    conn = get_db()
    
    total_equipos = conn.execute('SELECT COUNT(*) FROM equipos').fetchone()[0]
    equipos_activos = conn.execute("SELECT COUNT(*) FROM equipos WHERE estado='activo'").fetchone()[0]
    equipos_baja = conn.execute("SELECT COUNT(*) FROM equipos WHERE estado='baja'").fetchone()[0]
    equipos_mantenimiento = conn.execute("SELECT COUNT(*) FROM equipos WHERE estado='mantenimiento'").fetchone()[0]
    equipos_repuesto = conn.execute("SELECT COUNT(*) FROM equipos WHERE estado='repuesto'").fetchone()[0]
    total_proveedores = conn.execute('SELECT COUNT(*) FROM proveedores').fetchone()[0]
    
    # Equipos por tipo
    por_tipo = conn.execute('''
        SELECT tipo, COUNT(*) as cantidad FROM equipos GROUP BY tipo
    ''').fetchall()
    
    # Últimos movimientos
    ultimos_movimientos = conn.execute('''
        SELECT h.*, e.nombre as equipo_nombre
        FROM hojas_vida h
        JOIN equipos e ON h.equipo_id = e.id
        ORDER BY h.fecha DESC LIMIT 10
    ''').fetchall()
    
    conn.close()
    
    return jsonify({
        'total_equipos': total_equipos,
        'equipos_activos': equipos_activos,
        'equipos_baja': equipos_baja,
        'equipos_mantenimiento': equipos_mantenimiento,
        'equipos_repuesto': equipos_repuesto,
        'total_proveedores': total_proveedores,
        'por_tipo': [dict(t) for t in por_tipo],
        'ultimos_movimientos': [dict(m) for m in ultimos_movimientos]
    })

@app.route('/health', methods=['GET'])
def health():
    conn = get_db()
    total_equipos = conn.execute('SELECT COUNT(*) FROM equipos').fetchone()[0]
    total_proveedores = conn.execute('SELECT COUNT(*) FROM proveedores').fetchone()[0]
    conn.close()
    
    return jsonify({
        'status': 'ok',
        'database': 'SQLite',
        'total_equipos': total_equipos,
        'total_proveedores': total_proveedores,
        'message': 'API de Inventario funcionando correctamente'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
