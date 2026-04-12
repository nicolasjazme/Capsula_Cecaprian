/**
 * Capa de datos Cecaprian → Supabase.
 * Requiere cargar antes: https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
 * La sesión de aplicación usa sessionStorage (clave cecaprian_sesion), no localStorage.
 */
(function (global) {
  'use strict';

  var SUPABASE_URL = 'https://ovzogjfodcbhhpaduhsx.supabase.co';
  var SUPABASE_ANON_KEY = 'sb_publishable_KO3_49qLCvGfO9uaTsnu4w_zQToP2Mh';
  var SESION_KEY = 'cecaprian_sesion';

  function getClient() {
    if (!global._cecaprianSb) {
      if (typeof global.supabase === 'undefined') {
        throw new Error('Carga @supabase/supabase-js antes que cecaprian-db.js');
      }
      global._cecaprianSb = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return global._cecaprianSb;
  }

  function rowToCapsula(r) {
    return {
      id: r.id,
      carpetaId: r.carpeta_id || undefined,
      unidad: r.unidad || '',
      titulo: r.titulo,
      descripcion: r.descripcion || '',
      videoUrl: r.video_url || '',
      videoData: r.video_url || '',
      fecha: r.fecha
    };
  }

  global.CecaprianDB = {
    getSesion: function () {
      try {
        var raw = sessionStorage.getItem(SESION_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },
    setSesion: function (obj) {
      sessionStorage.setItem(SESION_KEY, JSON.stringify(obj));
    },
    clearSesion: function () {
      sessionStorage.removeItem(SESION_KEY);
    },
    getClient: getClient,

    getCarpetas: async function () {
      var res = await getClient().from('carpetas').select('*').order('created_at', { ascending: true });
      if (res.error) throw res.error;
      return (res.data || []).map(function (r) {
        return { id: r.id, nombre: r.nombre, descripcion: r.descripcion || '' };
      });
    },

    insertCarpeta: async function (nombre, descripcion) {
      var id = String(Date.now());
      var res = await getClient().from('carpetas').insert({ id: id, nombre: nombre, descripcion: descripcion || '' });
      if (res.error) throw res.error;
      return id;
    },

    updateCarpeta: async function (id, nombre, descripcion) {
      var res = await getClient().from('carpetas').update({ nombre: nombre, descripcion: descripcion || '' }).eq('id', id);
      if (res.error) throw res.error;
    },

    deleteCarpeta: async function (id) {
      var res = await getClient().from('carpetas').delete().eq('id', id);
      if (res.error) throw res.error;
    },

    countCapsulasEnCarpeta: async function (carpetaId) {
      var res = await getClient()
        .from('capsulas')
        .select('*', { count: 'exact', head: true })
        .eq('carpeta_id', carpetaId);
      if (res.error) throw res.error;
      return res.count || 0;
    },

    getCapsulas: async function () {
      var res = await getClient().from('capsulas').select('*').order('fecha', { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(rowToCapsula);
    },

    insertCapsula: async function (carpetaId, unidad, titulo, descripcion, videoUrl) {
      var id = String(Date.now());
      var res = await getClient().from('capsulas').insert({
        id: id,
        carpeta_id: carpetaId || null,
        unidad: unidad,
        titulo: titulo,
        descripcion: descripcion || '',
        video_url: videoUrl,
        fecha: new Date().toISOString()
      });
      if (res.error) throw res.error;
      return id;
    },

    updateCapsula: async function (capsulaId, fields) {
      var payload = {};
      if (fields.unidad !== undefined) payload.unidad = fields.unidad;
      if (fields.titulo !== undefined) payload.titulo = fields.titulo;
      if (fields.descripcion !== undefined) payload.descripcion = fields.descripcion;
      if (fields.videoUrl !== undefined) payload.video_url = fields.videoUrl;
      if (fields.carpetaId !== undefined) payload.carpeta_id = fields.carpetaId || null;
      var res = await getClient().from('capsulas').update(payload).eq('id', capsulaId);
      if (res.error) throw res.error;
    },

    deleteCapsula: async function (capsulaId) {
      var res = await getClient().from('capsulas').delete().eq('id', capsulaId);
      if (res.error) throw res.error;
    },

    getEvaluaciones: async function () {
      var res = await getClient().from('evaluaciones').select('*').order('fecha', { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(function (r) {
        var preguntas = r.preguntas;
        if (typeof preguntas === 'string') {
          try {
            preguntas = JSON.parse(preguntas);
          } catch (e) {
            preguntas = [];
          }
        }
        return {
          id: r.id,
          titulo: r.titulo,
          descripcion: r.descripcion || '',
          preguntas: preguntas || [],
          fecha: r.fecha
        };
      });
    },

    insertEvaluacion: async function (ev) {
      var res = await getClient().from('evaluaciones').insert({
        id: ev.id,
        titulo: ev.titulo,
        descripcion: ev.descripcion || '',
        preguntas: ev.preguntas,
        fecha: ev.fecha || new Date().toISOString()
      });
      if (res.error) throw res.error;
    },

    updateEvaluacion: async function (id, ev) {
      var res = await getClient()
        .from('evaluaciones')
        .update({
          titulo: ev.titulo,
          descripcion: ev.descripcion || '',
          preguntas: ev.preguntas
        })
        .eq('id', id);
      if (res.error) throw res.error;
    },

    deleteEvaluacion: async function (id) {
      var res = await getClient().from('evaluaciones').delete().eq('id', id);
      if (res.error) throw res.error;
    },

    getRespuestasEvaluaciones: async function () {
      var res = await getClient().from('respuestas_evaluaciones').select('*');
      if (res.error) throw res.error;
      return (res.data || []).map(function (r) {
        var out = {
          usuarioId: r.usuario_id,
          evaluacionId: r.evaluacion_id,
          aciertos: r.aciertos,
          total: r.total,
          porcentaje: r.porcentaje,
          fecha: r.fecha
        };
        if (r.evaluacion_titulo) out.evaluacionTitulo = r.evaluacion_titulo;
        if (r.detalle) {
          if (r.detalle.respuestas) out.respuestas = r.detalle.respuestas;
          if (r.detalle.aprobado !== undefined) out.aprobado = r.detalle.aprobado;
        }
        return out;
      });
    },

    insertRespuestaEvaluacion: async function (row) {
      var id = row.id || 'r_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
      var detalle = null;
      if (row.respuestas || row.aprobado !== undefined) {
        detalle = {};
        if (row.respuestas) detalle.respuestas = row.respuestas;
        if (row.aprobado !== undefined) detalle.aprobado = row.aprobado;
      }
      var payload = {
        id: id,
        usuario_id: row.usuarioId,
        evaluacion_id: row.evaluacionId,
        aciertos: row.aciertos,
        total: row.total,
        porcentaje: row.porcentaje,
        fecha: row.fecha || new Date().toISOString(),
        evaluacion_titulo: row.evaluacionTitulo || null,
        detalle: detalle
      };
      var res = await getClient().from('respuestas_evaluaciones').insert(payload);
      if (res.error) throw res.error;
    },

    deleteRespuestasUsuarioEvaluacion: async function (usuarioId, evaluacionId) {
      var res = await getClient()
        .from('respuestas_evaluaciones')
        .delete()
        .eq('usuario_id', usuarioId)
        .eq('evaluacion_id', evaluacionId);
      if (res.error) throw res.error;
    },

    getDocumentos: async function () {
      var res = await getClient().from('documentos').select('*').order('fecha', { ascending: false });
      if (res.error) throw res.error;
      return (res.data || []).map(function (r) {
        return {
          id: r.id,
          nombre: r.nombre,
          contenido: r.contenido,
          tamanio: r.tamanio,
          tipo: r.tipo,
          fecha: r.fecha
        };
      });
    },

    insertDocumento: async function (doc) {
      var res = await getClient().from('documentos').insert({
        id: doc.id,
        nombre: doc.nombre,
        contenido: doc.contenido,
        tamanio: doc.tamanio,
        tipo: doc.tipo || 'application/pdf',
        fecha: doc.fecha || new Date().toISOString()
      });
      if (res.error) throw res.error;
    },

    deleteDocumento: async function (id) {
      var res = await getClient().from('documentos').delete().eq('id', id);
      if (res.error) throw res.error;
    },

    getUsuarios: async function () {
      var res = await getClient().from('usuarios').select('*');
      if (res.error) throw res.error;
      return (res.data || []).map(function (u) {
        return {
          id: u.id,
          username: u.nombre,
          password: u.password,
          fecha: u.fecha_creacion || u.created_at || new Date().toISOString()
        };
      });
    },

    insertUsuario: async function (username, password) {
      var row = { nombre: username, password: password };
      var res = await getClient().from('usuarios').insert(row);
      if (res.error) throw res.error;
    },

    updateUsuarioPassword: async function (username, password) {
      var res = await getClient().from('usuarios').update({ password: password }).eq('nombre', username);
      if (res.error) throw res.error;
    },

    deleteUsuarioByUsername: async function (username) {
      var res = await getClient().from('usuarios').delete().eq('nombre', username);
      if (res.error) throw res.error;
    },

    loginUsuario: async function (username, password) {
      var res = await getClient().from('usuarios').select('*').eq('nombre', username).eq('password', password).maybeSingle();
      if (res.error) throw res.error;
      return res.data;
    }
  };
})(typeof window !== 'undefined' ? window : globalThis);
