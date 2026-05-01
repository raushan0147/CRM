import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  leads: [],
  loading: false,
  error: null,
  selectedLead: null,
  stats: {
    total: 0,
    new: 0,
    contacted: 0,
    converted: 0,
    closed: 0,
  },
};

const leadSlice = createSlice({
  name: 'leads',
  initialState,
  reducers: {
    setLeadsLoading(state, action) {
      state.loading = action.payload;
    },
    setLeads(state, action) {
      state.leads = action.payload;
      // Compute stats
      state.stats.total = action.payload.length;
      state.stats.new = action.payload.filter(l => l.status === 'new').length;
      state.stats.contacted = action.payload.filter(l => l.status === 'contacted').length;
      state.stats.converted = action.payload.filter(l => l.status === 'converted').length;
      state.stats.closed = action.payload.filter(l => l.status === 'closed').length;
    },
    addLead(state, action) {
      state.leads.unshift(action.payload);
      state.stats.total += 1;
      state.stats.new += 1;
    },
    updateLead(state, action) {
      const idx = state.leads.findIndex(l => l._id === action.payload._id);
      if (idx !== -1) {
        const old = state.leads[idx];
        // Update stats - decrement old status
        if (state.stats[old.status] !== undefined) state.stats[old.status] -= 1;
        // Increment new status
        if (state.stats[action.payload.status] !== undefined) state.stats[action.payload.status] += 1;
        state.leads[idx] = action.payload;
      }
    },
    removeLead(state, action) {
      const lead = state.leads.find(l => l._id === action.payload);
      if (lead) {
        state.leads = state.leads.filter(l => l._id !== action.payload);
        state.stats.total -= 1;
        if (state.stats[lead.status] !== undefined) state.stats[lead.status] -= 1;
      }
    },
    setSelectedLead(state, action) {
      state.selectedLead = action.payload;
    },
    setLeadsError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setLeadsLoading,
  setLeads,
  addLead,
  updateLead,
  removeLead,
  setSelectedLead,
  setLeadsError,
} = leadSlice.actions;

export default leadSlice.reducer;
