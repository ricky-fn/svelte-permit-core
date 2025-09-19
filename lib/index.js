import "svelte/internal/disclose-version";
import * as e from "svelte/internal/client";
import { onDestroy as E, setContext as w, getContext as _ } from "svelte";
import { writable as x } from "svelte/store";
import { createAccessControl as F, ComponentAccessAction as y, createRouteAccessAction as S, MenuAccessAction as L, createDropdownAccessAction as D } from "permit-core";
export * from "permit-core";
function I(v, t) {
  e.push(t, !0);
  const [p, h] = e.setup_stores(), o = () => e.store_get(g, "$currentRole", p), l = F({ roles: t.roles }), g = x(null), u = x(null);
  let A = e.state(null), c = e.state(null);
  t.groups.forEach((s) => l.addGroup(s)), t.roles.forEach((s) => l.addRole(s));
  const a = t.account.subscribe((s) => {
    if (s && s.role !== e.get(c) && (e.set(c, s.role, !0), e.store_set(g, l.getRoleByCode(e.get(c))), !g))
      throw new Error("role is not registered in the access control module");
    if (s || (e.store_set(g, null), e.store_set(u, null), e.set(c, null), e.set(A, null)), s != null && s.groupFlag && g) {
      const C = l.getGroupByCode(s.groupFlag);
      C ? (o().resetGroup(), o().assignGroup(C), e.store_set(u, C), e.set(A, C.getCode(), !0)) : (o().resetGroup(), e.store_set(u, null), e.set(A, null));
    }
  });
  E(a), w("AccessControl", l), w("CurrentAccessRole", g), w("CurrentAccessRoleGroup", u);
  var d = e.comment(), m = e.first_child(d);
  e.snippet(m, () => t.children), e.append(v, d), e.pop(), h();
}
function j(v, t) {
  e.push(t, !0);
  const [p, h] = e.setup_stores(), o = () => e.store_get(u, "$currentRole", p), l = () => e.store_get(A, "$currentRoleGroup", p), g = _("AccessControl"), u = _("CurrentAccessRole"), A = _("CurrentAccessRoleGroup");
  let c = e.state(!1), a = e.state(!1), d = e.state(void 0), m = e.state(void 0), s = e.state(e.proxy([]));
  e.user_effect(() => {
    var r, n;
    if (o() && (o().getCode() !== e.get(d) || ((r = l()) == null ? void 0 : r.getCode()) !== e.get(m) || o().getPermissions().length !== e.get(s).length)) {
      e.set(d, o().getCode(), !0), e.set(m, (n = l()) == null ? void 0 : n.getCode(), !0), e.set(s, o().getPermissions(), !0);
      const G = new y(e.get(d), { identifier: t.identifier, action: "view" });
      g.checkPermissions(G, {
        onSuccess: (P) => {
          e.set(c, !0);
        },
        onFailure: (P) => {
          e.set(c, !1);
        }
      });
      const b = new y(e.get(d), { identifier: t.identifier, action: "edit" });
      g.checkPermissions(b, {
        onSuccess: (P) => {
          e.set(a, !0);
        },
        onFailure: (P) => {
          e.set(a, !1);
        }
      });
    }
  });
  var C = e.comment(), R = e.first_child(C);
  {
    var f = (r) => {
      var n = e.comment(), G = e.first_child(n);
      e.snippet(G, () => t.children, () => ({ isEditable: e.get(a), role: o() })), e.append(r, n);
    }, i = (r, n) => {
      {
        var G = (b) => {
          var P = e.comment(), k = e.first_child(P);
          e.snippet(k, () => t.fallback, () => ({ role: o() })), e.append(b, P);
        };
        e.if(
          r,
          (b) => {
            t.fallback && b(G);
          },
          n
        );
      }
    };
    e.if(R, (r) => {
      e.get(c) ? r(f) : r(i, !1);
    });
  }
  e.append(v, C), e.pop(), h();
}
function z(v, t) {
  e.push(t, !0);
  const [p, h] = e.setup_stores(), o = () => e.store_get(u, "$currentRole", p), l = () => e.store_get(A, "$currentRoleGroup", p), g = _("AccessControl"), u = _("CurrentAccessRole"), A = _("CurrentAccessRoleGroup");
  let c = e.state(!1), a = e.state(void 0), d = e.state(void 0), m = e.state(e.proxy([]));
  e.user_effect(() => {
    var i, r;
    if (o() && (o().getCode() !== e.get(a) || ((i = l()) == null ? void 0 : i.getCode()) !== e.get(d) || o().getPermissions().length !== e.get(m).length)) {
      e.set(a, o().getCode(), !0), e.set(d, (r = l()) == null ? void 0 : r.getCode(), !0), e.set(m, o().getPermissions(), !0);
      const n = S(e.get(a), { route: t.route });
      g.checkPermissions(n, {
        onSuccess: () => {
          e.set(c, !0);
        },
        onFailure: () => {
          e.set(c, !1);
        }
      });
    }
  });
  var s = e.comment(), C = e.first_child(s);
  {
    var R = (i) => {
      var r = e.comment(), n = e.first_child(r);
      e.snippet(n, () => t.children, () => ({ role: u, route: t.route })), e.append(i, r);
    }, f = (i) => {
      var r = e.comment(), n = e.first_child(r);
      e.snippet(n, () => t.fallback, () => ({ role: u, route: t.route })), e.append(i, r);
    };
    e.if(C, (i) => {
      e.get(c) ? i(R) : i(f, !1);
    });
  }
  e.append(v, s), e.pop(), h();
}
function H(v, t) {
  e.push(t, !0);
  const [p, h] = e.setup_stores(), o = () => e.store_get(u, "$currentRole", p), l = () => e.store_get(A, "$currentRoleGroup", p), g = _("AccessControl"), u = _("CurrentAccessRole"), A = _("CurrentAccessRoleGroup");
  let c = e.state(e.proxy([])), a = e.state(void 0), d = e.state(void 0), m = e.state(e.proxy([]));
  e.user_effect(() => {
    var R, f;
    if (o() && (o().getCode() !== e.get(a) || ((R = l()) == null ? void 0 : R.getCode()) !== e.get(d) || o().getPermissions().length !== e.get(m).length)) {
      e.set(a, o().getCode(), !0), e.set(d, (f = l()) == null ? void 0 : f.getCode(), !0), e.set(m, o().getPermissions(), !0);
      const i = new L(e.get(a), { identifier: t.identifier, menu: t.menuList });
      g.checkPermissions(i, {
        onSuccess: (r) => {
          const n = o().getPermissions("menu")[0];
          e.set(c, n.getAccessibleList(r), !0);
        },
        onFailure: () => {
          e.set(c, [], !0);
        }
      });
    }
  });
  var s = e.comment(), C = e.first_child(s);
  e.each(C, 17, () => t.menuList, e.index, (R, f, i) => {
    var r = e.comment(), n = e.first_child(r), G = e.derived_safe_equal(() => ({
      isEditable: e.get(c).includes(e.get(f)),
      role: u,
      menu: e.get(f),
      index: i
    }));
    e.snippet(n, () => t.children, () => e.get(G)), e.append(R, r);
  }), e.append(v, s), e.pop(), h();
}
function J(v, t) {
  e.push(t, !0);
  const [p, h] = e.setup_stores(), o = () => e.store_get(u, "$currentRole", p), l = () => e.store_get(A, "$currentRoleGroup", p), g = _("AccessControl"), u = _("CurrentAccessRole"), A = _("CurrentAccessRoleGroup");
  let c = e.state(void 0), a = e.state(void 0), d = e.state(e.proxy([])), m = e.state(e.proxy([]));
  e.user_effect(() => {
    var R, f;
    if (o() && (o().getCode() !== e.get(c) || ((R = l()) == null ? void 0 : R.getCode()) !== e.get(a) || o().getPermissions().length !== e.get(d).length)) {
      e.set(c, o().getCode(), !0), e.set(a, (f = l()) == null ? void 0 : f.getCode(), !0), e.set(d, o().getPermissions(), !0);
      const i = D(e.get(c), { identifier: t.identifier, dropdown: t.list });
      g.checkPermissions(i, {
        onSuccess: (r) => {
          const n = o().getPermissions("dropdown")[0];
          e.set(m, n.getAccessibleList(r), !0);
        },
        onFailure: () => {
          e.set(m, [], !0);
        }
      });
    }
  });
  var s = e.comment(), C = e.first_child(s);
  e.each(C, 17, () => t.list, e.index, (R, f, i) => {
    var r = e.comment(), n = e.first_child(r), G = e.derived_safe_equal(() => ({
      isEditable: e.get(m).includes(e.get(f)),
      role: u,
      item: e.get(f),
      index: i
    }));
    e.snippet(n, () => t.children, () => e.get(G)), e.append(R, r);
  }), e.append(v, s), e.pop(), h();
}
export {
  I as AccessControlProvider,
  j as ComponentAccessControl,
  J as DropdownAccessControl,
  H as MenuAccessControl,
  z as RouteAccessControl
};
//# sourceMappingURL=index.js.map
